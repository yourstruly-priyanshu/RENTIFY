import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase_config';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './ExploreScreenStyles';

const ExploreScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('New Arrivals');

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

  // Generate unique products for each category to avoid repetition
  const filterProducts = (category) => {
    let filtered = [...products];

    if (category === 'Discounts') {
      filtered = filtered
        .filter((item) => item.discount)
        .map((item) => ({
          ...item,
          discountedPrice: (item.pricePerDay * 0.9).toFixed(2), // 10% off
        }));
    } else if (category === 'Deal of the Day') {
      filtered = filtered
        .filter((item) => item.dealOfTheDay)
        .map((item) => ({
          ...item,
          discountedPrice: (item.pricePerDay * 0.85).toFixed(2), // 15% off
        }));
    }

    return filtered.slice(0, 8); // Limit to 8 items to ensure variety
  };

  const displayedProducts = filterProducts(selectedCategory);

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
            onPress={() => setSelectedCategory(category.name)}
          >
            <Icon name={category.icon} size={24} color="#FF0000" />
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product List - Scrollable in 2 Columns */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlatList
          data={displayedProducts}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                {selectedCategory === 'Discounts' && (
                  <Text style={styles.discountText}>10% OFF</Text>
                )}
                {selectedCategory === 'Deal of the Day' && (
                  <Text style={styles.dealText}>🔥 Special Deal!</Text>
                )}
                <Text style={styles.productPrice}>
                  ₹{item.discountedPrice || item.pricePerDay}/day
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </ScrollView>

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
