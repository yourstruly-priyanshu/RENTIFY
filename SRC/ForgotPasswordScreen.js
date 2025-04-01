import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Animated } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase_config';
import styles from './stylesheets/ForgotPasswordScreenStyles'; // Import styles separately

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
    outputRange: ['#FFCCCB', '#FFFFFF'], // Light red to white
  });

  const handleResetPassword = () => {
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Password reset email sent! Check your inbox.");
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset your password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
