import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image, Alert, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, setDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProductScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [images, setImages] = useState([]);

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Save the product to Firestore
  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to list a product.');
      navigation.navigate('Login');
      return;
    }

    if (!name || !category || !description || !location || !pricePerDay) {
      Alert.alert('Error', 'Please fill in all the product details.');
      return;
    }

    try {
      // Save the product information
      const productRef = doc(collection(db, 'products'));
      await setDoc(productRef, {
        name,
        category,
        description,
        location,
        pricePerDay,
        images,
        userId: user.uid, // Associate the product with the logged-in user
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Product listed successfully!');
      // Reset form fields
      setName('');
      setCategory('');
      setDescription('');
      setLocation('');
      setPricePerDay('');
      setImages([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to list product.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    if (images.length >= 5) {
      Alert.alert('Error', 'You can only upload up to 5 images.');
      return;
    }
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `product_images/${user.uid}/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    setImages([...images, downloadURL]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Product Listing</Text>

          {/* Display uploaded images */}
          <ScrollView horizontal>
            {images.map((pic, index) => (
              <Image key={index} source={{ uri: pic }} style={styles.productImage} />
            ))}
          </ScrollView>

          {/* Upload Image Button */}
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Input fields */}
          <TextInput style={styles.input} placeholder='Product Name' value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder='Category' value={category} onChangeText={setCategory} />
          <TextInput style={styles.input} placeholder='Description' value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder='Location' value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder='Price Per Day' value={pricePerDay} onChangeText={setPricePerDay} keyboardType="numeric" />

          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>List Product</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loginBox}>
          <Text style={styles.notLoggedInText}>You must be logged in to list a product.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5e5d5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  loginBox: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
