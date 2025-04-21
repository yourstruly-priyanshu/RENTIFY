import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
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

    const numberOfDays = Math.ceil(Math.abs(tomorrow - today) / (1000 * 60 * 60 * 24)) || 1;
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

    setCartItems((prev) => [...prev, newItem]);

    const saveToFirestore = async () => {
      try {
        const cartRef = collection(db, "users", user.uid, "cart");
        await addDoc(cartRef, newItem);
        navigation.navigate("CartScreen", { cartItems: [...cartItems, newItem] });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
      }
    };
    saveToFirestore();
  }, [product, productId, navigation, cartItems]);

  if (loading) {
    return <ActivityIndicator size="large" color="#5C6BC0" style={{ marginTop: 100 }} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>₹{product.pricePerDay} / day</Text>
      <Text style={styles.location}>📍 {product.location}</Text>

      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.rentButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => navigation.navigate("Payment", { product })}
        >
          <Text style={styles.buttonText}>Rent Now</Text>
        </Pressable>
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.cartButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={addToCart}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: "#5C6BC0",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#43A047",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#0288D1",
    marginBottom: 20,
  },
  buttonWrapper: {
    marginTop: 10,
    width: "80%",
  },
  rentButton: {
    backgroundColor: "#5C6BC0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cartButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 200,
  },
});

export default ProductScreen;
