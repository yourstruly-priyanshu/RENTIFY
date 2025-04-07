import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_config";

const ProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "rentalProducts", productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          setProduct(productSnap.data());
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Product not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <View style={styles.card}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.price}>₹{product.pricePerDay} / day</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.location}>📍 {product.location}</Text>
      </View>

      <View style={[styles.card, styles.buttonWrapper]}>
        <Button
          title="Rent Now"
          onPress={() => navigation.navigate("Payment", { product })}
          color="#ff6600"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#FFCCCB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    color: "gray",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 200,
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductScreen;
