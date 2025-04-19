import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase_config";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./stylesheets/HomeScreenStyles";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const auth = getAuth();
  const searchInputRef = useRef(null); // Ref to manage TextInput focus

  const categories = [
    { name: "Furniture", icon: "bed" },
    { name: "Vehicles", icon: "car" },
    { name: "Sports", icon: "futbol-o" },
    { name: "Fashion", icon: "shopping-bag" },
    { name: "Electronics", icon: "laptop" },
    { name: "Events", icon: "calendar" },
  ];

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

  const handleSearch = (text) => {
    setSearchText(text);
    setFilteredProducts(
      text
        ? products.filter((p) => p.name.toLowerCase().includes(text.toLowerCase()))
        : products
    );
    // Ensure focus remains on the TextInput
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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
    setSearchText(""); // Clear search when returning to home
    setFilteredProducts(products);
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Refocus after clearing
    }
  };

  const renderHeader = () => (
    <View>
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
                  selectedCategory === item.name && { color: "#fff" }, // Fixed color for selected
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
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search (Moved outside FlatList) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Everything for Rent</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef} // Add ref to manage focus
            style={styles.searchBar}
            placeholder="Search rentals..."
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={false} // Prevent auto-focus on mount if not desired
            returnKeyType="search" // Optional: Improves UX
          />
        </View>
      </View>

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
