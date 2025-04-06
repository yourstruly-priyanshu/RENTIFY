import React, { useState, useEffect } from 'react';
import {
 TextInput,
 TouchableOpacity,
 Text,
 View,
 Image,
 Alert,
} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './stylesheets/ProfileScreenStyles'; // Your stylesheet


export default function ProfileScreen({ navigation }) {
 const [user, setUser] = useState(null);
 const [name, setName] = useState('');
 const [dob, setDob] = useState('');
 const [contact, setContact] = useState('');
 const [email, setEmail] = useState('');
 const [profilePic, setProfilePic] = useState(null);


 // Check media permission on load
 useEffect(() => {
   (async () => {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
     if (status !== 'granted') {
       Alert.alert('Permission Denied', 'Media library access is required.');
     }
   })();
 }, []);


 // Fetch user data from Firestore
 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
     if (currentUser) {
       console.log('User Logged In:', currentUser.uid);
       setUser(currentUser);
       try {
         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
         if (userDoc.exists()) {
           const data = userDoc.data();
           setName(data.name || '');
           setDob(data.dob || '');
           setContact(data.contact || '');
           setEmail(data.email || '');
           setProfilePic(data.profilePic || null);
         }
       } catch (error) {
         console.error('Failed to load user data:', error);
       }
     } else {
       setUser(null);
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
     await updateDoc(doc(db, 'users', user.uid), {
       name,
       dob,
       contact,
       email,
       profilePic,
     });
     Alert.alert('Success', 'Profile updated successfully!');
   } catch (error) {
     console.error('Error updating profile:', error);
     Alert.alert('Error', 'Failed to update profile.');
   }
 };


 const pickImage = async () => {
   try {
     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [1, 1],
       quality: 1,
     });


     if (!result.canceled) {
       const uri = result.assets[0].uri;
       await uploadImage(uri);
     }
   } catch (error) {
     console.error('Image picking failed:', error);
     Alert.alert('Error', 'Could not open gallery.');
   }
 };


 const uploadImage = async (uri) => {
   try {
     if (!user) return;


     const response = await fetch(uri);
     const blob = await response.blob();
     const storageRef = ref(storage, `profile_pictures/${user.uid}`);
     await uploadBytes(storageRef, blob);


     const downloadURL = await getDownloadURL(storageRef);
     setProfilePic(downloadURL);


     await updateDoc(doc(db, 'users', user.uid), {
       profilePic: downloadURL,
     });


     Alert.alert('Success', 'Profile picture updated!');
   } catch (error) {
     console.error('Image upload failed:', error);
     Alert.alert('Upload Error', 'Failed to upload image.');
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


         <TextInput
           style={styles.input}
           placeholder='Name'
           value={name}
           onChangeText={setName}
         />
         <TextInput
           style={styles.input}
           placeholder='DOB'
           value={dob}
           onChangeText={setDob}
         />
         <TextInput
           style={styles.input}
           placeholder='Contact'
           value={contact}
           onChangeText={setContact}
         />
         <TextInput
           style={styles.input}
           placeholder='Email'
           value={email}
           onChangeText={setEmail}
         />


         <TouchableOpacity style={styles.button} onPress={handleSave}>
           <Text style={styles.buttonText}>Save Profile</Text>
         </TouchableOpacity>
       </>
     ) : (
       <View style={styles.loginBox}>
         <Text style={styles.notLoggedInText}>
           You must be logged in to view your profile.
         </Text>
         <TouchableOpacity
           style={styles.loginButton}
           onPress={() => navigation.navigate('LoginScreen')}
         >
           <Text style={styles.loginButtonText}>Go to Login</Text>
         </TouchableOpacity>
       </View>
     )}
   </View>
 );
}


