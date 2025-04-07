import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase_config";

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product, cartItems } = route.params || {};

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Determine if we're handling a single product or cart items
  const items = cartItems || (product ? [product] : []);
  const totalAmount = items.reduce((sum, item) => sum + (item.pricePerDay * (item.quantity || 1)), 0);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUPIPayment = () => {
    setLoadingMessage("Processing payment via UPI...");
    setIsLoading(true);
    setTimeout(() => confirmPayment("UPI"), 2000); // Simulated delay
  };

  const handleCashOnDelivery = () => {
    setLoadingMessage("Awaiting seller confirmation...");
    setIsLoading(true);
    setTimeout(() => confirmPayment("Cash on Delivery"), 2000); // Simulated delay
  };

  const confirmPayment = async (method) => {
    if (!user) {
      Alert.alert("Login Required", "Please login to continue");
      setIsLoading(false);
      return;
    }

    try {
      // Create an order for each item
      for (const item of items) {
        await addDoc(collection(db, "orders"), {
          productId: item.id,
          productName: item.name,
          amount: item.pricePerDay * (item.quantity || 1),
          quantity: item.quantity || 1,
          paymentMethod: method,
          userId: user.uid,
          status: method === "Cash on Delivery" ? "Pending" : "Paid",
          createdAt: serverTimestamp(),
        });
      }
    }/* catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Failed to process order. Please try again.");
    } */finally {
      setIsLoading(false);
      Alert.alert("Success", `Your rental is confirmed via ${method}.`);
      navigation.navigate("Home");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginBoxWrapper}>
          <View style={styles.loginBox}>
            <Text style={styles.notLoggedInText}>You must log in to rent items.</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No items to process payment for.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#B22222" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      )}

      <Text style={styles.title}>Choose Payment Method</Text>

      {items.map((item, index) => (
        <View key={`${item.id}-${index}`} style={styles.itemContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            ₹{item.pricePerDay * (item.quantity || 1)}
            {item.quantity > 1 ? ` (${item.quantity} × ₹${item.pricePerDay}/day)` : ""}
          </Text>
        </View>
      ))}

      <Text style={styles.totalPrice}>Total: ₹{totalAmount}</Text>

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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: "#FFDADA",
  },
  loginBoxWrapper: {
    alignItems: "center",
  },
  loginBox: {
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: "center",
    color: "#8B0000",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#B22222",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    color: "#333",
  },
  itemPrice: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 30,
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "80%",
    alignSelf: "center",
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
    alignSelf: "center",
    alignItems: "center",
  },
  buttonTextOutline: {
    color: "#ff6f00",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
});

export default PaymentScreen;
