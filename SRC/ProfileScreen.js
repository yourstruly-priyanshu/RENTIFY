import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Image, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './stylesheets/ProfileScreenStyles'; // Importing the external stylesheet

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
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || '');
          setDob(userData.dob || '');
          setContact(userData.contact || '');
          setEmail(userData.email || '');
          setProfilePic(userData.profilePic || null);
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
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        dob,
        contact,
        email,
        profilePic,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    setProfilePic(downloadURL);
    await updateDoc(doc(db, 'users', user.uid), { profilePic: downloadURL });
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
