// signin signup
import React, { useState, useEffect } from 'react';
import { 
  TextInput, TouchableOpacity, Text, View, Animated, 
  KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase_config';
import { collection, addDoc } from 'firebase/firestore';
import styles from './stylesheets/SignupScreenStyles'; 

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
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
    outputRange: ['#FFFFFF', '#FFFFFF'], // Light red to white (consistent with login page)
  });

  const handleSignup = async () => {
    setError('');
    if (!name || !dob || !contact || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        dob,
        contact,
        email,
      });
      navigation.navigate('Home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolateColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Create an account to get started.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>NAME</Text>
          <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />

          <Text style={styles.label}>DATE OF BIRTH</Text>
          <TextInput style={styles.input} placeholder="DD/MM/YYYY" value={dob} onChangeText={setDob} keyboardType="numeric" />

          <Text style={styles.label}>CONTACT NUMBER</Text>
          <TextInput style={styles.input} placeholder="Enter your phone number" value={contact} onChangeText={setContact} keyboardType="phone-pad" />

          <Text style={styles.label}>EMAIL</Text>
          <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>PASSWORD</Text>
          <TextInput style={styles.input} placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
