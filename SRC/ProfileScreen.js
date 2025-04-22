import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Image, Alert, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [savePressed, setSavePressed] = useState(false);
  const [logoutPressed, setLogoutPressed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setDob(data.dob || '');
          setContact(data.contact || '');
          setEmail(data.email || '');
          setLocation(data.location || '');
          setProfileImage(data.profileImage || null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to edit your profile.');
      navigation.navigate('Login');
      return;
    }

    setSavePressed(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        dob,
        contact,
        email,
        location,
        profileImage,
      }, { merge: true });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSavePressed(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (uri) {
          await uploadImage(uri);
        } else {
          throw new Error("Image URI not found.");
        }
      } else {
        console.log("Image picking canceled or no assets found.");
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert("Error", "Could not open image picker.");
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExtension = uri.split('.').pop();
      const fileName = `profile_${user.uid}.${fileExtension || 'jpg'}`;
      const imageRef = ref(storage, `profile_pictures/${fileName}`);

      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      setProfileImage(downloadURL);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { profileImage: downloadURL }, { merge: true });

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      Alert.alert('Error', 'Image upload failed.');
    }
  };

  const handleLogout = async () => {
    setLogoutPressed(true);
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out.');
    } finally {
      setLogoutPressed(false);
    }
  };

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo.length > 0) {
        let address = `${geo[0].name || ''} ${geo[0].street || ''}, ${geo[0].city || ''}, ${geo[0].region || ''}`;
        setLocation(address.trim());
      } else {
        Alert.alert('Error', 'Could not fetch location details.');
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Error', 'Failed to fetch location.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hey User,</Text>
        <TouchableOpacity onPress={() => Alert.alert('Contact Us', 'Contact support at support@example.com')}>
          <Ionicons name="mail-outline" size={24} color="#00A3AD" />
        </TouchableOpacity>
      </View>

      {user ? (
        <>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileText}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder='Name'
              placeholderTextColor='#8A8A8A'
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder='DOB'
              placeholderTextColor='#8A8A8A'
              value={dob}
              onChangeText={setDob}
            />
            <TextInput
              style={styles.input}
              placeholder='Contact'
              placeholderTextColor='#8A8A8A'
              value={contact}
              onChangeText={setContact}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              placeholderTextColor='#8A8A8A'
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder='Enter or fetch location'
                placeholderTextColor='#8A8A8A'
                value={location}
                onChangeText={setLocation}
              />
              <TouchableOpacity onPress={fetchLocation} style={[styles.locationButton, styles.highlightedButton]}>
                <Ionicons name="location-outline" size={24} color="#00A3AD" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, savePressed && styles.pressedButton]}
            onPress={handleSave}
            onPressOut={() => setSavePressed(false)}
          >
            <Text style={[styles.buttonText, savePressed && styles.pressedButtonText]}>Save Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, logoutPressed && styles.pressedButton]}
            onPress={handleLogout}
            onPressOut={() => setLogoutPressed(false)}
          >
            <Text style={[styles.buttonText, logoutPressed && styles.pressedButtonText]}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loginBox}>
          <Text style={styles.notLoggedInText}>
            You must be logged in to view your profile.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Light grey border for contrast
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
  },
  notificationIcon: {
    color: '#000000',
    fontSize: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00A3AD',
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A2A2A', // Grey placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00A3AD',
  },
  profileText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#F5F5F5', // Lighter grey for card
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardTitle: {
    color: '#00A3AD',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardText: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  cardButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    color: '#000000',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  locationButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedButton: {
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  pressedButton: {
    backgroundColor: '#ADD8E6',
  },
  pressedButtonText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  loginBox: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    marginTop: 50,
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 15,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Light grey border for contrast
  },
  headerTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
  },
  notificationIcon: {
    color: '#000000',
    fontSize: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00A3AD',
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2A2A2A', // Grey placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00A3AD',
  },
  profileText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#F5F5F5', // Lighter grey for card
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardTitle: {
    color: '#00A3AD',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardText: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  cardButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    color: '#000000',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  locationButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedButton: {
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  pressedButton: {
    backgroundColor: '#ADD8E6',
  },
  pressedButtonText: {
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  loginBox: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    marginTop: 50,
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 15,
  },
});