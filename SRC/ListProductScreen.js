import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase_config"; // Import Firestore instance

export default function ListProductScreen({ navigation }) {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    pricePerDay: "",
    imageUrl: "",
    description: "",
    location: "",
    available: true,
  });

  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!product.name || !product.category || !product.pricePerDay || !product.imageUrl || !product.description || !product.location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const collectionRef = collection(db, "rentalProducts");
      await addDoc(collectionRef, {
        ...product,
        pricePerDay: Number(product.pricePerDay), // Convert price to number
      });

      Alert.alert("Success", "Product listed successfully!");
      setProduct({ name: "", category: "", pricePerDay: "", imageUrl: "", description: "", location: "", available: true });
      navigation.navigate("Home"); // Redirect to Home after listing
    } catch (error) {
      console.error("Error adding product: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Your Product for Rent</Text>

      <TextInput style={styles.input} placeholder="Product Name" value={product.name} onChangeText={(value) => handleChange("name", value)} />
      <TextInput style={styles.input} placeholder="Category" value={product.category} onChangeText={(value) => handleChange("category", value)} />
      <TextInput style={styles.input} placeholder="Price Per Day" keyboardType="numeric" value={product.pricePerDay} onChangeText={(value) => handleChange("pricePerDay", value)} />
      <TextInput style={styles.input} placeholder="Image URL" value={product.imageUrl} onChangeText={(value) => handleChange("imageUrl", value)} />
      <TextInput style={styles.input} placeholder="Description" value={product.description} onChangeText={(value) => handleChange("description", value)} />
      <TextInput style={styles.input} placeholder="Location" value={product.location} onChangeText={(value) => handleChange("location", value)} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>List Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
