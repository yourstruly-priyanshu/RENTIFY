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
<<<<<<< HEAD
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rentalProducts'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(productList); // Debugging line
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} /> {/* Product Image */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || 'Unnamed Product'}</Text>
        <Text style={styles.productDescription}>{item.description || 'No description available.'}</Text>
        <Text style={styles.productPrice}>Price: ${item.pricePerDay}/day</Text>
        <Text style={styles.productAvailability}>
          {item.available ? 'Available' : 'Not Available'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Picks!</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
=======
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

      // No need to manually apply discounts since Firestore has the correct field
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
            <Icon name={category.icon} size={24} color="#FF4500" />
            <Text style={styles.categoryText}>{category.name}</Text>
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
                  onPress={() => navigation.navigate('ProductPage', { productId: item.id })}
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
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
    </View>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFA500',
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
=======
export default ExploreScreen;
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
