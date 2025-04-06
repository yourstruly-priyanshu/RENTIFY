//product
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Image, Alert, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, setDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './stylesheets/ListProductScreenStyles'; 

export default function ProductScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to list a product.');
      navigation.navigate('Login');
      return;
    }

    if (!name || !category || !description || !location || !pricePerDay || !imageUrl) {
      Alert.alert('Error', 'Please fill in all the product details.');
      return;
    }

    try {
      const productRef = doc(collection(db, 'rentalProducts'));
      await setDoc(productRef, {
        name,
        category,
        description,
        location,
        pricePerDay,
        available,
        imageUrl,
        userId: user.uid,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Product listed successfully!');
      setName('');
      setCategory('');
      setDescription('');
      setLocation('');
      setPricePerDay('');
      setImageUrl('');
      setAvailable(true);
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
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `product_images/${user.uid}/${Date.now()}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    setImageUrl(downloadURL);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Product Listing</Text>
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.productImage} /> : null}
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder='Product Name' value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder='Product Image URL' value={imageUrl} onChangeText={setImageUrl} />
          <TextInput style={styles.input} placeholder='Category' value={category} onChangeText={setCategory} />
          <TextInput style={styles.input} placeholder='Description' value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder='Location' value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder='Price Per Day' value={pricePerDay} onChangeText={setPricePerDay} keyboardType="numeric" />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>List Product</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.loginBox}>
          <Text style={styles.notLoggedInText}>You must be logged in to list a product.</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
