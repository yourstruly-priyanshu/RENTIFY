import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, FlatList, Platform, Image, View, Text } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase_config';
import styles from './LoginScreenStyles'; // Import the styles

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
    outputRange: ['#FFCCCB', '#FFFFFF'], // Light red to white
  });

  const handleLogin = () => {
    setError('');
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Logged in successfully");
        navigation.replace("Home");
      })
      .catch(error => setError(error.message));
  };

  const renderItem = () => (
    <View style={styles.scrollContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/logo.png')} // Path to your PNG image
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

      <Text style={styles.link} onPress={() => navigation.navigate('SignupScreen')}>Sign up</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        Forgot Password?
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <FlatList
          data={[{}]} // Dummy data to render the item
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
