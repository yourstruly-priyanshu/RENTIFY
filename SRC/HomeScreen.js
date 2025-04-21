import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase_config";
import styles from "./stylesheets/HomeScreenStyles";

const bannerImages = [
  require("./assets/banner1.png"),
  require("./assets/banner2.png"),
  require("./assets/banner3.png"),
];

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollRef = useRef(null);
  const [bannerIndex, setBannerIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (bannerIndex + 1) % bannerImages.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * Dimensions.get("window").width,
        animated: true,
      });
      setBannerIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerIndex]);

  useEffect(() => {
    filterProducts();
  }, [searchText, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchText.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = [
    { name: "Furniture", icon: "bed" },
    { name: "Vehicles", icon: "car" },
    { name: "Sports", icon: "futbol-o" },
    { name: "Fashion", icon: "shopping-bag" },
    { name: "Electronics", icon: "laptop" },
    { name: "Events", icon: "calendar" },
  ];

  const renderHeader = () => (
    <View>
      {/* Banners */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        style={styles.bannerContainer}
      >
        {bannerImages.map((img, idx) => (
          <Image key={idx} source={img} style={styles.bannerImage} />
        ))}
      </ScrollView>

      {/* Promo */}
      <View
        style={{
          backgroundColor: "#000",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 10,
          margin: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          10% OFF for new customers!
        </Text>
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
              onPress={() => {
                if (selectedCategory === item.name) {
                  setSelectedCategory(null); // unselect
                } else {
                  setSelectedCategory(item.name);
                }
              }}
            >
              <Icon
                name={item.icon}
                size={24}
                color={selectedCategory === item.name ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.name && { color: "#fff" },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Rentals` : "Best Sellers"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar OUTSIDE FlatList */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search rentals..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Product list */}
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

      {/* Floating Cart */}
      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Icon name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { name: "Home", icon: "home" },
          { name: "Explore", icon: "compass" },
          { name: "ListProduct", icon: "plus-circle" },
          { name: "Profile", icon: "user" },
          { name: "Chat", icon: "comments" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon name={item.icon} size={22} color="#fff" />
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
