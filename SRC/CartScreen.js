import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DatePicker from "react-native-date-picker"; // Install: npm install react-native-date-picker
import { db } from "./firebase_config"; // Import db from firebase_config.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Modular Firestore imports

const CartScreen = ({ navigation, route }) => {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  // Calculate number of days between start and end date
  const calculateDays = () => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; // Ensure at least 1 day
  };

  // Calculate total amount for all items
  const calculateTotalAmount = () => {
    const days = calculateDays();
    return cartItems.reduce((total, item) => total + item.pricePerDay * days, 0);
  };

  const removeFromCart = (index) => {
    setCartItems((prevItems) => {
      const updatedCart = [...prevItems];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length > 0) {
      const days = calculateDays();
      const totalAmount = calculateTotalAmount();

      // Save order to Firestore
      try {
        await addDoc(collection(db, "orders"), {
          userId: "user-id-placeholder", // Replace with actual user ID (e.g., auth.currentUser.uid)
          cartItems,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          days,
          totalAmount,
          createdAt: serverTimestamp(),
        });
        navigation.navigate("Payment", { cartItems, startDate, endDate, days, totalAmount });
      } catch (error) {
        console.error("Error saving order to Firestore:", error.message);
      }
    }
  };

  const renderCartItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.cartImage} />
      <View style={styles.cartInfo}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>₹{item.pricePerDay}/day</Text>
        <Text style={styles.cartDays}>Days: {calculateDays()}</Text>
        <Text style={styles.cartTotal}>
          Total: ₹{item.pricePerDay * calculateDays()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(index)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {/* Date Pickers */}
      <View style={styles.datePickerContainer}>
        <View style={styles.datePicker}>
          <Text style={styles.dateLabel}>Start Date:</Text>
          <TouchableOpacity onPress={() => setOpenStartPicker(true)}>
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openStartPicker}
            date={startDate}
            onConfirm={(date) => {
              setOpenStartPicker(false);
              setStartDate(date);
              if (date > endDate) setEndDate(date); // Ensure end date is not before start
            }}
            onCancel={() => setOpenStartPicker(false)}
            minimumDate={new Date()}
          />
        </View>
        <View style={styles.datePicker}>
          <Text style={styles.dateLabel}>End Date:</Text>
          <TouchableOpacity onPress={() => setOpenEndPicker(true)}>
            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openEndPicker}
            date={endDate}
            onConfirm={(date) => {
              setOpenEndPicker(false);
              setEndDate(date);
            }}
            onCancel={() => setOpenEndPicker(false)}
            minimumDate={startDate}
          />
        </View>
      </View>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderCartItem}
          />
          <Text style={styles.totalAmount}>
            Total Amount: ₹{calculateTotalAmount()}
          </Text>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}

      <TouchableOpacity
        style={[styles.checkoutButton, !cartItems.length && styles.disabledButton]}
        onPress={handleCheckout}
        disabled={!cartItems.length}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#007bff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  cartItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  cartInfo: {
    flex: 1,
    marginLeft: 10,
  },
  cartName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  cartDays: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  cartTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default CartScreen;