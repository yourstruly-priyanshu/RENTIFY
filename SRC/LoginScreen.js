import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Animated, Dimensions, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase_config';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
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

  const handleLogin = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Logged in successfully");
        navigation.replace("Home");  // 👈 This ensures user is taken to HomeScreen
      })
      .catch(error => setError(error.message));
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.imageContainer}>
            <Image
              source={require('./assets/logo.png')} // Path to your PNG image
              style={styles.image}
              resizeMode="contain" // Adjust the image's size to fit the container
            />
          </View>

          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in to continue.</Text>

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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('SignupScreen')}>Sign up</Text>

          <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
            Forgot Password?
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
  imageContainer: {
    width: width * 0.6, // Width of the image container (60% of the screen width)
    height: height * 0.25, // Height of the image container (25% of the screen height)
    marginBottom: 20, // Space below the image
    justifyContent: 'center', // Center the image inside the container
    alignItems: 'center', // Center the image inside the container
  },
  image: {
    width: '100%', // Make the image fill the container width
    height: '100%', // Make the image fill the container height
    borderRadius: 20, // Optional: Add rounded corners to the image
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000', // Changed to black
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#000', // Changed to black
    marginBottom: 10,
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
    marginBottom: 15,
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
