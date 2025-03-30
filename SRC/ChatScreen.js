import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase_config'; // Ensure this path is correct
import axios from 'axios';

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
      const response = await axios.post(
        'https://api.gemini.ai/v1/chat',
        { message: userMessage },
        {
          headers: {
            'Authorization': `AIzaSyBb6zQ1gPtv2HqscSfaeJrTFh-T--EkP5I`, // Use an environment variable for security
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.reply || "I couldn't get a response from AI.";
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
          createdAt: serverTimestamp(), // Using Firestore's server timestamp
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
          userId: 'gemini', // AI messages are distinguished
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

  if (!user) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>You must log in to access chat.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    margin: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
  },
  aiMessage: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
  },
  systemMessage: {
    backgroundColor: "#FFD700",
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    marginLeft: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notLoggedInText: {
    fontSize: 16,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
  },
});

export default ChatScreen;
