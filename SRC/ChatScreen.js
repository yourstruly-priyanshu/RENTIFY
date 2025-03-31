import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase_config'; // Ensure this path is correct
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBnVsW3_Jzmy90dVAJQdEhaXWTgkfxml8o");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, 'chatMessages'),
          orderBy('createdAt', 'asc')
        );
        const querySnapshot = await getDocs(messagesQuery);
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (!messagesList.some(msg => msg.system)) {
          const welcomeMessage = {
            id: 'message',
            text: 'Hi, I am a chatbot. If you have any questions, feel free to ask!',
            createdAt: new Date(),
            system: true,
          };
          messagesList.unshift(welcomeMessage);
        }

        setMessages(messagesList);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages]);

  const getGeminiResponse = async (userMessage) => {
    try {
      const result = await model.generateContent(userMessage);
      return result.response.text() || "I couldn't get a response from AI.";
    } catch (error) {
      console.error('Error fetching response from Gemini AI:', error);
      return "Sorry, I'm unable to respond at the moment.";
    }
  };

  const handleSend = async () => {
    if (!user) {
      alert("Please log in to send messages.");
      return;
    }

    if (message.trim()) {
      try {
        const newMessage = {
          text: message,
          createdAt: serverTimestamp(),
          userId: user.uid,
        };
        const docRef = await addDoc(collection(db, 'chatMessages'), newMessage);
        setMessages(prevMessages => [...prevMessages, { id: docRef.id, ...newMessage }]);
        setMessage('');

        // Get response from Gemini AI
        const aiResponse = await getGeminiResponse(message);
        const aiMessage = {
          text: aiResponse,
          createdAt: serverTimestamp(),
          userId: 'gemini',
          system: true,
        };

        const aiDocRef = await addDoc(collection(db, 'chatMessages'), aiMessage);
        setMessages(prevMessages => [...prevMessages, { id: aiDocRef.id, ...aiMessage }]);

      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessage = ({ item }) => {
    const isSystemMessage = item.system;
    const isUserMessage = item.userId === user?.uid;
    const isAiMessage = item.userId === 'gemini';

    return (
      <View style={[
        styles.messageContainer,
        isSystemMessage ? styles.systemMessage : isUserMessage ? styles.userMessage : isAiMessage ? styles.aiMessage : styles.otherMessage,
        { alignSelf: isUserMessage ? 'flex-end' : 'flex-start' }
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#777"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" }, // White background
  messageList: { flex: 1 },
  
  messageContainer: { 
    margin: 8, 
    padding: 10, 
    borderRadius: 10, 
    maxWidth: "75%" 
  },
  
  userMessage: { 
    backgroundColor: "#FF3B30", // Red for user messages
    alignSelf: "flex-end", 
    padding: 10, 
    borderRadius: 10 
  },
  
  aiMessage: { 
    backgroundColor: "#FFD3D3", // Light red for AI messages
    alignSelf: "flex-start", 
    padding: 10, 
    borderRadius: 10 
  },
  
  systemMessage: { 
    backgroundColor: "#FF6B6B", // Slightly darker light red for system messages
    alignSelf: "center", 
    padding: 10, 
    borderRadius: 10 
  },
  
  messageText: { color: "#fff" }, // White text for better contrast
  
  inputContainer: { 
    flexDirection: "row", 
    padding: 10, 
    backgroundColor: "#fff" 
  },
  
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#FF3B30", // Red border for input
    borderRadius: 20, 
    paddingHorizontal: 10 
  },
  
  sendButton: { 
    backgroundColor: "#FF3B30", // Red send button
    padding: 10, 
    marginLeft: 8, 
    borderRadius: 20 
  },
  
  sendButtonText: { color: "#fff" } // White text for send button
});

export default ChatScreen;
