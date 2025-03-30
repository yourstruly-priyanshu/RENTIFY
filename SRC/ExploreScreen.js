import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase_config'; // Ensure this path is correct


const ExploreScreen = () => {
 const [products, setProducts] = useState([]);


 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const querySnapshot = await getDocs(collection(db, 'rentalProducts'));
       const productList = querySnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));
       setProducts(productList);
     } catch (error) {
       console.error('Error fetching products:', error);
     }
   };


   fetchProducts();
 }, []);


const renderItem = ({ item }) => (
 <View style={styles.productContainer}>
   <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
   <View style={styles.productInfo}>
     <Text style={styles.productName}>{item.name}</Text>
     <Text style={styles.productDescription}>{item.description}</Text>
     <Text style={styles.productPrice}>Price: ${item.pricePerDay}/day</Text>
     <Text style={styles.productAvailability}>
       {item.available ? 'Available' : 'Not Available'}
     </Text>
   </View>
 </View>
);




 return (
   <View style={styles.container}>
     <Text style={styles.title}>New Arrivals</Text>
     <FlatList
       data={products}
       renderItem={renderItem}
       keyExtractor={(item) => item.id}
       contentContainerStyle={styles.list}
     />
   </View>
 );
};


const styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 20,
   backgroundColor: '#f5e5d5',
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 20,
   textAlign: 'center',
 },
 list: {
   paddingBottom: 20,
 },
 productContainer: {
   alignItems: 'center', // Center the content
   marginBottom: 15,
   padding: 10,
   backgroundColor: '#fff',
   borderRadius: 8,
   elevation: 2,
 },
 productImage: {
   width: 100, // Adjust width as needed
   height: 100, // Adjust height as needed
   borderRadius: 8,
   marginBottom: 10, // Space between image and text
 },
 productInfo: {
   alignItems: 'center', // Center the text
 },
 productName: {
   fontSize: 18,
   fontWeight: 'bold',
 },
 productDescription: {
   fontSize: 14,
   color: '#555',
   textAlign: 'center', // Center the description text
   marginBottom: 5, // Space between description and price
 },
 productPrice: {
   fontSize: 16,
   fontWeight: 'bold',
   marginBottom: 5, // Space between price and availability
 },
 productAvailability: {
   fontSize: 14,
   color: 'green', // Default color for availability
 },
});


export default ExploreScreen;


