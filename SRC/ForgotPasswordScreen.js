import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase_config'; // import your firebase_config

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
        // Show a success message
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
