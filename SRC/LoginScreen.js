import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Image,
  View,
  Text,
} from 'react-native';

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase_config';
import styles from './stylesheets/LoginScreenStyles';

// Google Sign-in packages
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Ensure auth session completes properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const animatedValue = useState(new Animated.Value(0))[0];

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID_HERE',
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID_HERE',
    webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
  });

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

  // Handle Google login response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("✅ Google login success!");
          navigation.replace("Home");
        })
        .catch((err) => {
          console.error("❌ Google login error: ", err);
          setError(err.message);
        });
    }
  }, [response]);

  const interpolateColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFCCCB', '#FFFFFF'], // Light red to white
  });

  const handleLogin = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("✅ Logged in successfully");
        navigation.replace("Home");
      })
      .catch(error => {
        console.error("❌ Login error:", error);
        setError(error.message);
      });
  };

  const renderItem = () => (
    <View style={styles.scrollContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.image}
          resizeMode="contain"
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

      {/* 🔵 Google Login Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4285F4' }]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('SignupScreen')}
      >
        Sign up
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('ForgotPasswordScreen')}
      >
        Forgot Password?
      </Text>
    </View>
  );

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: interpolateColor }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={[{}]} // Dummy data
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
