import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Animated, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase_config'; // import your firebase_config

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const animatedValue = useState(new Animated.Value(0))[0];
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

  const handleSignup = () => {
    setError('');
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Account created successfully");
        navigation.navigate('Login');  // Navigate to login screen after successful signup
      })
      .catch(error => setError(error.message));
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@reallygreatsite.com"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Changed to black
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000', // Changed to black
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#000', // Changed to black
    marginBottom: 5,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#000', // Changed to black
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#000', // Changed to black
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000', // Changed to black
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  link: {
    color: '#000', // Changed to black
    marginTop: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
