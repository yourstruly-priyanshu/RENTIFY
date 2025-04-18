import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
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

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID_HERE',
    iosClientId: 'YOUR_IOS_CLIENT_ID_HERE',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID_HERE',
    webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
  });

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

      {/* ✅ Transparent Google Login Button */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          marginTop: 10,
          backgroundColor: 'transparent',
        }}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={require('./assets/google_icon.png')}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text style={[styles.buttonText, { color: '#B22222' }]}>
          Sign in with Google
        </Text>
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
    <View style={[styles.container, { backgroundColor: '#FFFFFF', flex: 1 }]}>
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
    </View>
  );
}
