import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, ActivityIndicator } from "react-native";
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
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>₹{product.pricePerDay} / day</Text>
      <Text style={styles.location}>📍 {product.location}</Text>

      <Button
        title="Rent Now"
        onPress={() => navigation.navigate("Payment", { product })}
        color="#ff6600"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  image: { width: "100%", height: 250, resizeMode: "cover", borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  category: { fontSize: 18, color: "gray" },
  description: { fontSize: 16, marginTop: 10, textAlign: "center" },
  price: { fontSize: 20, fontWeight: "bold", color: "green", marginTop: 5 },
  location: { fontSize: 16, color: "blue", marginTop: 5 },
  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

export default ProductScreen;
