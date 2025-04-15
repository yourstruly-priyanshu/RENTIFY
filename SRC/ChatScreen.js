import React, { useEffect, useState, useRef } from 'react';
import {
 View, Text, StyleSheet, TextInput, TouchableOpacity,
 FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import {
 collection, doc, getDoc, getDocs, addDoc, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase_config';
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AIzaSyBHQx-oHCMjUlZQjk1lJy1ZJiiSGiR9YXU");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


const ChatScreen = ({ navigation }) => {
 const [message, setMessage] = useState('');
 const [messages, setMessages] = useState([]);
 const [user, setUser] = useState(null);
 const [userData, setUserData] = useState(null);
 const flatListRef = useRef(null);


 useEffect(() => {
   const auth = getAuth();
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
     if (!currentUser) setUserData(null);
   });
   return () => unsubscribe();
 }, []);


 useEffect(() => {
   if (!user) return;


   const fetchUserData = async () => {
     try {
       // Fetch order history (document, not collection)
       const orderDocRef = doc(db, 'users', user.uid, 'orders', user.uid);
       const orderDoc = await getDoc(orderDocRef);
       const orders = orderDoc.exists() ? orderDoc.data() : {};


       // Fetch preferences
       const preferencesRef = collection(db, 'users', user.uid, 'preferences');
       const preferencesSnapshot = await getDocs(preferencesRef);
       const preferences = preferencesSnapshot.docs.map(doc => doc.data());


       // Fetch past chat messages
       const userMessagesRef = collection(db, 'users', user.uid, 'chatMessages');
       const messagesQuery = query(userMessagesRef, orderBy('createdAt', 'asc'));
       const querySnapshot = await getDocs(messagesQuery);
       const messagesList = querySnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));


       if (!messagesList.some(msg => msg.system)) {
         const welcomeMessage = {
           id: 'welcome',
           text: 'Hi, I am RentifyPro’s support chatbot. Ask me about renting items, app issues, or customer support!',
           createdAt: new Date(),
           system: true,
         };
         messagesList.unshift(welcomeMessage);
       }


       setUserData({ orders, preferences });
       setMessages(messagesList);
     } catch (error) {
       console.error('Error fetching user data:', error);
     }
   };


   fetchUserData();
 }, [user]);


 useEffect(() => {
   setTimeout(() => {
     flatListRef.current?.scrollToEnd({ animated: true });
   }, 200);
 }, [messages]);


 const getGeminiResponse = async (userMessage) => {
   try {
     // Build strict prompt for RentifyPro
     let prompt = `You are a customer support chatbot for RentifyPro, a product rental app. Respond ONLY to questions or issues related to renting items, app functionality (e.g., booking, payment, delivery), or customer support within RentifyPro. If the user's message is unrelated, politely redirect them to ask about RentifyPro issues. The user's message is: "${userMessage}". `;


     if (userData) {
       if (userData.orders && Object.keys(userData.orders).length > 0) {
         prompt += `The user’s order history: ${JSON.stringify(userData.orders)}. `;
       }
       if (userData.preferences && userData.preferences.length > 0) {
         prompt += `The user prefers these categories: ${userData.preferences.map(p => p.category).join(', ')}. `;
       }
       prompt += `Use this information to personalize the response, ensuring it addresses the user’s history or preferences when relevant. `;
     } else {
       prompt += `No user data is available, so provide a general response focused on RentifyPro’s renting or support. `;
     }
     prompt += `Keep the response concise, professional, and strictly relevant to RentifyPro.`;


     const result = await model.generateContent(prompt);
     return result.response.text() || "I couldn't get a response from AI.";
   } catch (error) {
     console.error('Gemini error:', error);
     return "Sorry, I’m unable to assist with that right now. Please try again or ask about RentifyPro support.";
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


       const userMessagesRef = collection(db, 'users', user.uid, 'chatMessages');
       const docRef = await addDoc(userMessagesRef, newMessage);


       setMessages(prevMessages => [...prevMessages, { id: docRef.id, ...newMessage }]);
       setMessage('');


       const aiResponse = await getGeminiResponse(message);
       const aiMessage = {
         text: aiResponse,
         createdAt: serverTimestamp(),
         userId: 'gemini',
         system: true,
       };


       const aiDocRef = await addDoc(userMessagesRef, aiMessage);
       setMessages(prevMessages => [...prevMessages, { id: aiDocRef.id, ...aiMessage }]);
     } catch (error) {
       console.error('Send error:', error);
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
       isSystemMessage ? styles.systemMessage :
         isUserMessage ? styles.userMessage : styles.aiMessage,
       { alignSelf: isUserMessage ? 'flex-end' : 'flex-start' }
     ]}>
       <Text style={styles.messageText}>{item.text}</Text>
     </View>
   );
 };


 if (!user) {
   return (
     <View style={styles.loginBox}>
       <Text style={styles.notLoggedInText}>
         You must be logged in to use the RentifyPro chatbot.
       </Text>
       <TouchableOpacity
         style={styles.loginButton}
         onPress={() => navigation.navigate('LoginScreen')}
       >
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
         placeholder="Ask about RentifyPro rentals or support..."
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
   backgroundColor: '#FFF0F0',
 },
 messageList: {
   flex: 1,
   paddingHorizontal: 10,
   paddingTop: 10,
 },
 messageContainer: {
   marginBottom: 10,
   padding: 12,
   borderRadius: 12,
   maxWidth: '80%',
   shadowColor: '#000',
   shadowOpacity: 0.05,
   shadowRadius: 4,
   elevation: 2,
 },
 userMessage: {
   backgroundColor: '#DCF8C6',
 },
 aiMessage: {
   backgroundColor: '#DDEEFF',
 },
 systemMessage: {
   backgroundColor: '#F5F5F5',
 },
 messageText: {
   fontSize: 16,
   color: '#333',
 },
 inputContainer: {
   flexDirection: 'row',
   padding: 10,
   backgroundColor: '#FFF0F0',
   borderTopWidth: 1,
   borderColor: '#ddd',
 },
 input: {
   flex: 1,
   height: 60,
   backgroundColor: '#FFF',
   borderRadius: 20,
   paddingHorizontal: 15,
   fontSize: 16,
   borderWidth: 1,
   borderColor: '#ccc',
 },
 sendButton: {
   marginLeft: 10,
   backgroundColor: '#B22222',
   borderRadius: 20,
   paddingHorizontal: 20,
   justifyContent: 'center',
 },
 sendButtonText: {
   color: '#fff',
   fontSize: 16,
 },
 notLoggedInText: {
   fontSize: 18,
   textAlign: 'center',
   color: '#8B0000',
   marginBottom: 10,
 },
 loginBox: {
   width: '90%',
   padding: 20,
   borderRadius: 10,
   backgroundColor: '#fff',
   alignItems: 'center',
   shadowColor: '#000',
   shadowOpacity: 0.2,
   shadowRadius: 5,
   elevation: 5,
   marginTop: 15,
   alignSelf: 'center',
 },
 loginButton: {
   backgroundColor: '#B22222',
   padding: 12,
   borderRadius: 8,
   alignItems: 'center',
   width: '100%',
 },
 loginButtonText: {
   color: '#fff',
   fontSize: 16,
   fontWeight: 'bold',
 },
});


export default ChatScreen;



