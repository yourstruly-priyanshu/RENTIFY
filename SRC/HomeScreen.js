import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase_config";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./HomeScreenStyles"; // Import styles from the separate file

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userCountry, setUserCountry] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

  const categories = ["Electronics", "Furniture", "Vehicles", "Sports", "Fashion","Events"];

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        fetchUserCountry();
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's country from ISP when logged out
  const fetchUserCountry = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();
      if (data.status === "success") {
        setUserCountry(data.country);
      } else {
        console.error("Failed to fetch user country:", data.message);
        setUserCountry("Unknown");
      }
    } catch (error) {
      console.error("Error fetching user country:", error);
      setUserCountry("Unknown");
    }
  };

  // Fetch products and filter based on country if logged out
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rentalProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (!isLoggedIn && userCountry) {
          const countryFilteredProducts = productList.filter((product) => {
            const productLocation = product.location || "";
            const productCountry = productLocation.split(",").pop().trim().toLowerCase();
            return productCountry === userCountry.toLowerCase();
          });
          setProducts(countryFilteredProducts);
          setFilteredProducts(countryFilteredProducts);
        } else {
          setProducts(productList);
          setFilteredProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [isLoggedIn, userCountry]);

  // Set cart icon in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")} style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
          </View>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: "#007bff" },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#fff",
    });
  }, [navigation, cartItems]);

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  // Filter products by category
  const handleCategorySelect = (category) => {
    const filtered = products.filter((product) =>
      product.category?.toLowerCase() === category.toLowerCase()
    );
    setFilteredProducts(filtered.length > 0 ? filtered : products);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search for products"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryBox}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Items Section */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate("Product", { productId: item.id })}
            >
              <Image source={{ uri: item.imageUrl || "https://example.com/default-image.jpg" }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Our Recommendations Section */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>Our Recommendations</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate("Product", { productId: item.id })}
            >
              <Image source={{ uri: item.imageUrl || "https://example.com/default-image.jpg" }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Explore")}>
          <Icon name="compass" size={28} color="black" />
          <Text style={[styles.navText, { color: "black" }]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("ListProduct")}>
          <Icon name="plus-circle" size={28} color="black" />
          <Text style={[styles.navText, { color: "black" }]}>List Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
          <Icon name="user" size={28} color="black" />
          <Text style={[styles.navText, { color: "black" }]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Chat")}>
          <Icon name="comments" size={28} color="black" />
          <Text style={[styles.navText, { color: "black" }]}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
