import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase_config";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userCountry, setUserCountry] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();

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
        setUserCountry(data.country); // e.g., "India"
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

  return (
    <View style={styles.container}>
      {/* Header with RENTIFY name, cart, and login button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RENTIFY</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate("CartScreen")} style={styles.cartIconContainer}>
            <Icon name="shopping-cart" size={24} color="#fff" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

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

      {/* Popular Items Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popular Items</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          vertical
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate("ProductScreen", { productId: item.id })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Our Recommendations Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Our Recommendations</Text>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          vertical
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate("ProductScreen", { productId: item.id })}
            >
              <Image
                source={{ uri: item.imageUrl || "https://example.com/default-image.jpg" }}
                style={styles.productImage}
              />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e5d5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIconContainer: {
    marginRight: 20,
  },
  loginButton: {
    backgroundColor: "#FFA500", // Orange color
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 18,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#32CD32", // Light green color
  },
  productCard: {
    width: 140,
    height: 180,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "black",
  },
  productPrice: {
    fontSize: 12,
    color: "#555",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 3,
  },
  cartBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

