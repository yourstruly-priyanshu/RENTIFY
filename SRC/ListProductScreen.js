import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Text, View, Image, Alert, ScrollView, Modal, FlatList, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from './firebase_config';
import { doc, setDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import styles from './stylesheets/ListProductScreenStyles';

export default function ProductScreen({ navigation }) {
  const [user, setUser ] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = ['Furniture', 'Events', 'Vehicles', 'Sports', 'Fashion', 'Electronics'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser ) => {
      setUser (currentUser );
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

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setImageUrl(localUri); // display immediately
      await uploadImage(localUri); // upload silently
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ext = uri.split('.').pop();
      const storageRef = ref(storage, `product_media/${user.uid}/${Date.now()}.${ext}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL); // finally set firebase URL
    } catch (error) {

    }
    setUploading(false);
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
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setCategory(item);
        setCategoryModalVisible(false);
      }}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Product Listing</Text>

          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : null}

          {uploading && (
            <ActivityIndicator size="small" color="#5C6BC0" style={{ marginBottom: 10 }} />
          )}

          <TouchableOpacity onPress={pickMedia} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Upload Image/Video</Text>
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder='Product Name' value={name} onChangeText={setName} />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={category ? styles.inputText : styles.placeholderText}>
              {category || 'Category'}
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={categoryModalVisible}
            onRequestClose={() => setCategoryModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setCategoryModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item}
                    style={styles.categoryList}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <TextInput
            style={styles.input}
            placeholder='Description'
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={{ flexDirection: 'row', width: '90%', marginBottom: 15 }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder='Location'
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity onPress={fetchLocation} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="location-outline" size={24} color="#5C6BC0" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder='Price Per Day'
            value={pricePerDay}
            onChangeText={setPricePerDay}
            keyboardType="numeric"
          />

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