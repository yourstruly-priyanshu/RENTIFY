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
  const [profileImage, setProfileImage] = useState(null); // ✅ rename here

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
          setProfileImage(data.profileImage || null); // ✅ use 'profileImage' here
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
        profileImage, // ✅ save it with correct key
      }, { merge: true });

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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          await uploadImage(uri);
        } else {
          throw new Error("Image URI not found.");
        }
      } else {
        console.log("Image picking canceled or no assets found.");
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Could not open image picker.");
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExtension = uri.split('.').pop();
      const fileName = `profile_${user.uid}.${fileExtension || 'jpg'}`;
      const imageRef = ref(storage, `profile_pictures/${fileName}`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      setProfileImage(downloadURL); // ✅ update state

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { profileImage: downloadURL }, { merge: true }); // ✅ save as 'profileImage'

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      Alert.alert('Error', 'Image upload failed.');
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Profile Information</Text>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
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
