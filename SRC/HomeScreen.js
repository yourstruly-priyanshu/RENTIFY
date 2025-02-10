import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase_config"; // Import Firestore instance

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rentalProducts"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>RentifyPro</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.profileButton}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* List Product Button */}
      <TouchableOpacity onPress={() => navigation.navigate("ListProduct")} style={styles.listProductButton}>
        <Text style={styles.listProductButtonText}>List Your Own Product</Text>
      </TouchableOpacity>

      {/* Product Sections */}
      <Text style={styles.sectionTitle}>Popular Items</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("ProductPage", { productId: item.id })}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Our Recommendations</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => navigation.navigate("ProductPage", { productId: item.id })}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.pricePerDay}/day</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileButton: {
    fontSize: 16,
    color: "#007bff",
  },
  listProductButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  listProductButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    width: 150,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
});
