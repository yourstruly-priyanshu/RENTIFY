import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;

  const handlePayment = () => {
    // Here you would integrate Stripe, Razorpay, or PayPal
    alert("Payment Successful! Your rental is confirmed.");
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>Total: ₹{product.pricePerDay} / day</Text>
      <Button title="Pay Now" onPress={handlePayment} color="#ff6600" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  productName: { fontSize: 18, color: "gray", marginBottom: 10 },
  price: { fontSize: 20, fontWeight: "bold", color: "green", marginBottom: 20 },
});

export default PaymentScreen;
