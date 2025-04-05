import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase_config";

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUPIPayment = () => {
    Alert.alert("UPI Payment", "Redirecting to UPI app...");
    confirmPayment("UPI");
  };

  const handleCashOnDelivery = () => {
    confirmPayment("Cash on Delivery");
  };

  const confirmPayment = async (method) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to continue");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productName: product.name,
        amount: product.pricePerDay,
        paymentMethod: method,
        userId: user.uid,
        status: method === "Cash on Delivery" ? "Pending" : "Paid",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", `Your rental is confirmed via ${method}.`);
      navigation.navigate("Home");
    } catch (err) {
      console.error("Error confirming payment:", err);
      Alert.alert("Error", "Something went wrong while confirming your order.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>Total: ₹{product.pricePerDay} / day</Text>

      <TouchableOpacity style={styles.button} onPress={handleUPIPayment}>
        <Text style={styles.buttonText}>Pay with UPI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={handleCashOnDelivery}>
        <Text style={styles.buttonTextOutline}>Cash on Delivery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  productName: { fontSize: 18, color: "gray", marginBottom: 10 },
  price: { fontSize: 20, fontWeight: "bold", color: "green", marginBottom: 30 },
  button: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: "#ff6f00",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonTextOutline: {
    color: "#ff6f00",
    fontSize: 16,
  },
});

export default PaymentScreen;
