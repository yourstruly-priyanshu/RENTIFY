import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user
  const [email, setEmail] = useState(user ? user.email : '');

  const handleSave = () => {
    // Here you would typically update the user's profile in Firebase
    // For example, using updateProfile from Firebase Auth
    if (email) {
      // Update email logic here
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      Alert.alert('Error', 'Please enter a valid email.');
    }
  };

  const handleLogout = () => {
    // Logic to log out the user
    auth.signOut().then(() => {
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    }).catch((error) => {
      console.error('Error logging out: ', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      
      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5e5d5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
