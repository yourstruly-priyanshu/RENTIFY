import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Animated, Dimensions, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase_config';
import { collection, addDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

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
    outputRange: ['#E6C79F', '#FFE4C4'],
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
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#000',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  link: {
    color: '#000',
    marginTop: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
