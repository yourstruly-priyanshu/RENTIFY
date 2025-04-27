import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
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
  const [loading, setLoading] = useState(true);
  const [isReauthModalVisible, setIsReauthModalVisible] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('onAuthStateChanged triggered, user:', currentUser ? currentUser.uid : 'null');
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          console.log('Fetching user document from Firestore at path:', `users/${currentUser.uid}`);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log('User data fetched:', data);
            setName(data.name || '');
            setDob(data.dob || '');
            setContact(data.contact || '');
            setEmail(data.email || currentUser.email || '');
            setLocation(data.location || '');
            setProfileImage(data.profileImage || null);
            if (!data.name && !data.dob && !data.contact) {
              console.log('Profile incomplete, prompting user to save profile.');
              Alert.alert(
                'Complete Your Profile',
                'Please fill in your name, date of birth, and contact details to complete your profile.'
              );
            }
          } else {
            console.log('No user document found in Firestore for UID:', currentUser.uid);
            setEmail(currentUser.email || '');
            Alert.alert(
              'Profile Not Found',
              'No profile exists. Please fill in your details and save to create your profile.'
            );
          }
        } catch (error) {
          console.error('Error fetching user document:', error);
          if (error.code === 'permission-denied') {
            Alert.alert(
              'Permission Error',
              'Unable to access profile data due to Firestore permissions. Please ensure Firestore rules allow access or contact support.'
            );
          } else {
            Alert.alert('Error', 'Failed to load profile data: ' + error.message);
          }
        }
      } else {
        console.log('No authenticated user found.');
        navigation.navigate('LoginScreen');
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up onAuthStateChanged listener');
      unsubscribe();
    };
  }, [navigation]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to edit your profile.');
      navigation.navigate('Login');
      return;
    }

    if (!name || !dob || !contact) {
      Alert.alert('Error', 'Please fill in your name, date of birth, and contact details.');
      return;
    }

    setSavePressed(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updatedData = {
        name,
        dob,
        contact,
        email,
        location,
        profileImage,
        uid: user.uid, // Ensure uid field matches document ID
      };
      console.log('Saving profile data to:', `users/${user.uid}`, updatedData);
      await setDoc(userRef, updatedData, { merge: true });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Permission Error',
          'Unable to save profile due to Firestore permissions. Please ensure Firestore rules allow access or contact support.'
        );
      } else {
        Alert.alert('Error', 'Failed to update profile: ' + error.message);
      }
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
          throw new Error('Image URI not found.');
        }
      } else {
        console.log('Image picking canceled or no assets found.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
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

      console.log('Uploading image to:', `profile_pictures/${fileName}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      setProfileImage(downloadURL);

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { profileImage: downloadURL }, { merge: true });

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Permission Error',
          'Unable to save profile image due to Firestore permissions. Please ensure Firestore rules allow access or contact support.'
        );
      } else {
        Alert.alert('Error', 'Image upload failed: ' + error.message);
      }
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

  const handleDeleteAccount = () => {
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
    setIsReauthModalVisible(true);
  };

  const confirmReauthentication = async () => {
    try {
      if (!reauthPassword) {
        Alert.alert('Error', 'Please enter your password.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, reauthPassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      navigation.navigate('LoginScreen');
      setIsReauthModalVisible(false);
      setReauthPassword('');
    } catch (error) {
      console.error('Error during re-authentication or account deletion:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password. Please try again.');
      } else if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Error', 'Session expired. Please log in again.');
        navigation.navigate('LoginScreen');
        setIsReauthModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to delete account: ' + error.message);
      }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hey {name || 'User'},</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Contact Us', 'Contact support at support@example.com')}
          >
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
                placeholder="Name"
                placeholderTextColor="#A9A9A9"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                placeholderTextColor="#A9A9A9"
                value={dob}
                onChangeText={setDob}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact"
                placeholderTextColor="#A9A9A9"
                value={contact}
                onChangeText={setContact}
              />
              <Text style={styles.label}>Location</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.locationContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter or fetch location"
                    placeholderTextColor="#A9A9A9"
                    value={location}
                    onChangeText={setLocation}
                    editable={true}
                  />
                </View>
                <TouchableOpacity onPress={fetchLocation} style={[styles.locationButton, styles.highlightedButton]}>
                  <Ionicons name="location-outline" size={24} color="#00A3AD" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={savePressed}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={logoutPressed}
              >
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.noUserText}>Please log in to view your profile.</Text>
        )}
      </View>

      <Modal
        visible={isReauthModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsReauthModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your password"
              value={reauthPassword}
              onChangeText={setReauthPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.modalButton} onPress={confirmReauthentication}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsReauthModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 40,
    color: '#fff',
  },
  card: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  buttonsContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noUserText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalInput: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#00A3AD',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});