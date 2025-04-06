import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Image, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './stylesheets/ProfileScreenStyles';


export default function ProfileScreen({ navigation }) {
 const [user, setUser] = useState(null);
 const [name, setName] = useState('');
 const [dob, setDob] = useState('');
 const [contact, setContact] = useState('');
 const [email, setEmail] = useState('');
 const [profilePic, setProfilePic] = useState(null);


 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
     setUser(currentUser);
     if (currentUser) {
       const userRef = doc(db, 'users', currentUser.uid);
       const userDoc = await getDoc(userRef);
       if (userDoc.exists()) {
         const data = userDoc.data();
         setName(data.name || '');
         setDob(data.dob || '');
         setContact(data.contact || '');
         setEmail(data.email || '');
         setProfilePic(data.profilePic || null);
       }
     }
   });
   return () => unsubscribe();
 }, []);


 const handleSave = async () => {
   if (!user) {
     Alert.alert('Error', 'You must be logged in to edit your profile.');
     navigation.navigate('Login');
     return;
   }


   try {
     const userRef = doc(db, 'users', user.uid);
     await setDoc(userRef, {
       name,
       dob,
       contact,
       email,
       profilePic,
     }, { merge: true });
     Alert.alert('Success', 'Profile updated successfully!');
   } catch (error) {
     console.error('Error updating profile:', error);
     Alert.alert('Error', 'Failed to update profile.');
   }
 };


 const pickImage = async () => {
   const result = await ImagePicker.launchImageLibraryAsync({
     mediaTypes: ImagePicker.MediaType.Images, // ✅ fixed deprecation
     allowsEditing: true,
     aspect: [1, 1],
     quality: 1,
   });


   if (!result.canceled && result.assets && result.assets[0]?.uri) {
     const uri = result.assets[0].uri;
     await uploadImage(uri);
   }
 };


 const uploadImage = async (uri) => {
   try {
     if (!user) throw new Error('User not authenticated');


     const response = await fetch(uri);
     const blob = await response.blob();
     const imageRef = ref(storage, `profile_pictures/${user.uid}`);
     await uploadBytes(imageRef, blob);
     const downloadURL = await getDownloadURL(imageRef);
     setProfilePic(downloadURL);


     // Update Firestore with new profilePic URL
     const userRef = doc(db, 'users', user.uid);
     await setDoc(userRef, { profilePic: downloadURL }, { merge: true });


   } catch (error) {
     console.error('Image upload failed:', error);
     Alert.alert('Error', 'Image upload failed.');
   }
 };


 return (
   <View style={styles.container}>
     {user ? (
       <>
         <Text style={styles.title}>Profile Information</Text>
         <TouchableOpacity onPress={pickImage}>
           {profilePic ? (
             <Image source={{ uri: profilePic }} style={styles.profilePic} />
           ) : (
             <View style={styles.profilePlaceholder}>
               <Text style={styles.profileText}>+</Text>
             </View>
           )}
         </TouchableOpacity>


         <TextInput style={styles.input} placeholder='Name' value={name} onChangeText={setName} />
         <TextInput style={styles.input} placeholder='DOB' value={dob} onChangeText={setDob} />
         <TextInput style={styles.input} placeholder='Contact' value={contact} onChangeText={setContact} />
         <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} />


         <TouchableOpacity style={styles.button} onPress={handleSave}>
           <Text style={styles.buttonText}>Save Profile</Text>
         </TouchableOpacity>
       </>
     ) : (
       <View style={styles.loginBox}>
         <Text style={styles.notLoggedInText}>You must be logged in to view your profile.</Text>
         <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
           <Text style={styles.loginButtonText}>Go to Login</Text>
         </TouchableOpacity>
       </View>
     )}
   </View>
 );
}


