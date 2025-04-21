import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase_config';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './stylesheets/ExploreScreenStyles';

const ExploreScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('New Arrivals');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts('rentalProducts'); // Default collection for "New Arrivals"
  }, []);

  const fetchProducts = async (collectionName) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
    } catch (error) {
      console.error(`Error fetching products from ${collectionName}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === 'Discounts') {
      fetchProducts('Discount'); // Fetch from "Discount" collection
    } else if (category === 'Deal of the Day') {
      fetchProducts('Deals'); // Fetch from "Deals" collection
    } else {
      fetchProducts('rentalProducts'); // Fetch from default collection
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Selection Buttons */}
      <View style={styles.buttonContainer}>
        {[
          { name: 'New Arrivals', icon: 'star' },
          { name: 'Discounts', icon: 'tags' },
          { name: 'Deal of the Day', icon: 'fire' },
        ].map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => handleCategoryChange(category.name)}
          >
            <Icon
              name={category.icon}
              size={24}
              color={selectedCategory === category.name ? '#FFFFFF' : '#1A1A1A'} // White when selected, black otherwise
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF4500" style={{ marginTop: 20 }} />
      ) : (
        <>
          {/* Empty State Message */}
          {products.length === 0 ? (
            <Text style={styles.emptyMessage}>No products available.</Text>
          ) : (
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productContainer}
                  onPress={() => navigation.navigate('Product', { productId: item.id })}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>

                    {/* Show correct discount labels */}
                    {selectedCategory === 'Discounts' && (
                      <Text style={styles.discountText}>10% OFF</Text>
                    )}
                    {selectedCategory === 'Deal of the Day' && (
                      <Text style={styles.dealText}>🔥 Special Deal!</Text>
                    )}

                    {/* Use correct price field */}
                    <Text style={styles.productPrice}>
                      ₹
                      {selectedCategory === 'Discounts'
                        ? item.discountedPPD
                        : selectedCategory === 'Deal of the Day'
                        ? item.dealP
                        : item.pricePerDay}
                      /day
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </>
      )}

      {/* Floating Home Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default ExploreScreen;
