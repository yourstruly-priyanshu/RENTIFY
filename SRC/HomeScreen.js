import React, { useEffect, useState } from "react";
import {
<<<<<<< HEAD
  View, Text, FlatList, Image, TouchableOpacity, TextInput,ScrollView,
  SafeAreaView, StatusBar, Platform
=======
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase_config";
import Icon from "react-native-vector-icons/FontAwesome";
<<<<<<< HEAD
import styles from "./HomeScreenStyles"; // Import styles from separate file
=======
import styles from "./stylesheets/HomeScreenStyles";
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const auth = getAuth();

<<<<<<< HEAD
  const categories = ["Electrics", "Furniture", "Vehicles", "Sports", "Fashion", "Events"];

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (!user) fetchUserCountry();
    });
    return unsubscribe;
  }, []);

  // Fetch user's country from ISP when logged out
  const fetchUserCountry = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();
      setUserCountry(data.status === "success" ? data.country : "Unknown");
    } catch (error) {
      console.error("Error fetching user country:", error);
      setUserCountry("Unknown");
    }
  };

  // Fetch products from Firestore
=======
  const categories = [
    { name: "Furniture", icon: "bed" },
    { name: "Vehicles", icon: "car" },
    { name: "Sports", icon: "futbol-o" },
    { name: "Fashion", icon: "shopping-bag" },
    { name: "Electronics", icon: "laptop" },
    { name: "Events", icon: "calendar" },
  ];

>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rentalProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

<<<<<<< HEAD
  // Handle search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredProducts(
      text ? products.filter((p) => p.name.toLowerCase().includes(text.toLowerCase())) : products
    );
  };

  // Filter products by category
  const handleCategorySelect = (category) => {
    const filtered = products.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    setFilteredProducts(filtered.length > 0 ? filtered : products);
  };

  // Set cart icon in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")} style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: "#007bff" },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#fff",
    });
  }, [navigation, cartItems]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <View style={styles.container}>
        {/* Search Bar */}
=======
  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredProducts(
      text
        ? products.filter((p) => p.name.toLowerCase().includes(text.toLowerCase()))
        : products
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filtered = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered.length > 0 ? filtered : products);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleHomePress = () => {
    setSelectedCategory(null);
    setFilteredProducts(products);
  };

  const renderHeader = () => (
    <View>
      {/* Header with Search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Everything for Rent</Text>
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
<<<<<<< HEAD
            placeholder="Search for products"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {/* Categories Section */}
                <View style={styles.categoriesWrapper}>
                  <Text style={styles.categoriesTitle}>Categories</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row" }}>
                      {categories.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.categoryBox} onPress={() => handleCategorySelect(item)}>
                          <Text style={styles.categoryText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
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
              <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("Product", { productId: item.id })}>
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
              <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("Product", { productId: item.id })}>
                <Image source={{ uri: item.imageUrl || "https://example.com/default-image.jpg" }} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {[
            { name: "Explore", icon: "compass" },
            { name: "ListProduct", icon: "plus-circle" },
            { name: "Profile", icon: "user" },
            { name: "Chat", icon: "comments" },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.navItem} onPress={() => navigation.navigate(item.name)}>
              <Icon name={item.icon} size={28} color="black" />
              <Text style={[styles.navText, { color: "black" }]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
=======
            placeholder="Search rentals..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBox,
                selectedCategory === item.name && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(item.name)}
            >
              <Icon
                name={item.icon}
                size={24}
                color={selectedCategory === item.name ? "#fff" : "#FF4500"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && { color: "red" },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Section Title */}
      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Rentals` : "Popular Rentals"}
        </Text>
      </View>
    </View>
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridWrapper}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate("Product", { productId: item.id })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>₹{item.pricePerDay}/day</Text>
          </TouchableOpacity>
        )}
      />

      {/* Floating Cart Button */}
      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Icon name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { name: "Home", icon: "home", action: handleHomePress },
          { name: "Explore", icon: "compass" },
          { name: "ListProduct", icon: "plus-circle" },
          { name: "Profile", icon: "user" },
          { name: "Chat", icon: "comments" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => (item.action ? item.action() : navigation.navigate(item.name))}
          >
            <Icon name={item.icon} size={24} color="white" />
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
