import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Animated } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase_config'; // import your firebase_config

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const animatedValue = new Animated.Value(0); // Define animated value

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolateColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E6C79F', '#FFE4C4'],
  });

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
        // Show a success message (you could use a Toast or Alert here)
      })
      .catch(error => {
        setError(error.message);
        console.error(error.message);
      });
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#000', // Black border color
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'transparent', // Transparent background
  },
  buttonText: {
    color: '#000', // Black text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
