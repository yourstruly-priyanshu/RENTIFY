import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase_config";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./stylesheets/HomeScreenStyles";
import { debounce } from "lodash"; // npm install lodash

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
  const auth = getAuth();

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

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (scrollRef.current?.contentOffset?.x || 0) / Dimensions.get("window").width + 1;
      scrollRef.current?.scrollTo({
        x: (nextIndex % bannerImages.length) * Dimensions.get("window").width,
        animated: true,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((text) => {
        setFilteredProducts(
          text
            ? products.filter((p) =>
                p.name.toLowerCase().includes(text.toLowerCase())
              )
            : products
        );
      }, 300),
    [products]
  );

  const handleSearch = (text) => {
    setSearchText(text);
    debouncedSearch(text);
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

  const renderHeader = useMemo(
    () => () => (
      <View>
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search rentals..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

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
    ),
    [searchText, selectedCategory]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridWrapper}
        ListHeaderComponent={renderHeader()}
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

      <TouchableOpacity
        style={styles.floatingCart}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Icon name="shopping-cart" size={24} color="#fff" />
      </TouchableOpacity>

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
            <Icon name={item.icon} size={22} color="#fff" />
            <Text style={styles.navText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
