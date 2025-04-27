import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  View,
  Text,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase_config';
import styles from './stylesheets/LoginScreenStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("✅ Logged in successfully");
        navigation.replace("Home");
      })
      .catch(error => {
        const credentialErrors = [
          'auth/user-not-found',
          'auth/wrong-password',
          'auth/invalid-email',
        ];
        if (credentialErrors.includes(error.code)) {
          setError('Invalid email or password');
        } else {
          setError('Something went wrong. Please try again.');
        }
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF', flex: 1 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.imageContainer}>
            <Image
              source={require('./assets/logo2.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in to continue.</Text>

          {/* Error */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Email */}
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

          {/* Password */}
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Links */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
