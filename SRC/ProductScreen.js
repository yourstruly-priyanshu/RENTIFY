import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebase_config";

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params || {};

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          setLoading(false);
          return;
        }
        const productRef = doc(db, "rentalProducts", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.log("Product does not exist.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const addToCart = useCallback(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Login Required", "Please log in to add items to your cart.", [
        { text: "OK", onPress: () => navigation.navigate("LoginScreen") },
      ]);
      return;
    }

    if (!product) {
      Alert.alert("Error", "Product data is not available.");
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Calculate number of days
    const startDate = today;
    const endDate = tomorrow;
    const diffTime = Math.abs(endDate - startDate);
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = (product.pricePerDay || 0) * numberOfDays;

    const newItem = {
      id: productId,
      name: product.name || "Unnamed Item",
      pricePerDay: product.pricePerDay || 0,
      imageUrl: product.imageUrl || "https://via.placeholder.com/80",
      startDate: today.toISOString(),
      endDate: tomorrow.toISOString(),
      totalAmount,
      cartTimestamp: Date.now(),
      quantity: 1,
    };

    // Update state
    setCartItems((prevCartItems) => {
      const updatedCart = [...prevCartItems, newItem];
      return updatedCart;
    });

    // Save to Firestore
    const saveToFirestore = async () => {
      try {
        const cartRef = collection(db, "users", user.uid, "cart");
        await addDoc(cartRef, newItem);
        console.log("Item added to Firestore:", newItem);
        // Navigate after saving
        navigation.navigate("CartScreen", { cartItems: [...cartItems, newItem] });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
      }
    };
    saveToFirestore();
  }, [product, productId, navigation, cartItems]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>₹{product.pricePerDay} / day</Text>
      <Text style={styles.location}>📍 {product.location}</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="Rent Now"
          onPress={() => navigation.navigate("Payment", { product })}
          color="#ff6600"
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          title="Add to Cart"
          onPress={addToCart}
          color="#007bff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  category: {
    fontSize: 18,
    color: "gray",
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },
  location: {
    fontSize: 16,
    color: "blue",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 200,
  },
  buttonWrapper: {
    marginTop: 20,
    width: "60%",
  },
});

export default ProductScreen;
