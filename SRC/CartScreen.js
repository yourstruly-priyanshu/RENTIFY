import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "./firebase_config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CartScreen = ({ navigation, route }) => {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);
  const [user, setUser] = useState(null);
  const [pickerVisibility, setPickerVisibility] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setPickerVisibility({});
      return;
    }

    const fetchCart = async () => {
      try {
        const cartRef = collection(db, "users", user.uid, "cart");
        const snapshot = await getDocs(cartRef);

        if (snapshot.empty) {
          console.log("Cart subcollection is empty or doesn't exist yet.");
        }

        const cartData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Item",
            pricePerDay: data.pricePerDay || 0,
            imageUrl: data.imageUrl || "https://via.placeholder.com/80",
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate
              ? new Date(data.endDate)
              : new Date(new Date().setDate(new Date().getDate() + 1)),
            totalAmount: data.totalAmount || (data.pricePerDay || 0), // Fallback to pricePerDay if totalAmount missing
          };
        });
        setCartItems(cartData);
        const newVisibility = cartData.reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: { showStartPicker: false, showEndPicker: false },
          }),
          {}
        );
        setPickerVisibility(newVisibility);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  const calculateDays = (item) => {
    const diffTime = Math.abs(item.endDate - item.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.totalAmount || 0), 0);
  };

  const removeFromCart = async (index) => {
    if (!user) return;

    const itemId = cartItems[index].id;
    try {
      const cartDocRef = doc(db, "users", user.uid, "cart", itemId);
      await deleteDoc(cartDocRef);
      setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
      setPickerVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[itemId];
        return newVisibility;
      });
    } catch (error) {
      console.error("Error removing item from Firestore:", error);
    }
  };

  const updateItemDates = async (index, newStartDate, newEndDate) => {
    if (!user) return;

    const updatedItems = [...cartItems];
    const numberOfDays = Math.ceil(
      Math.abs(newEndDate - newStartDate) / (1000 * 60 * 60 * 24)
    ) || 1;
    const totalAmount = updatedItems[index].pricePerDay * numberOfDays;

    updatedItems[index] = {
      ...updatedItems[index],
      startDate: newStartDate,
      endDate: newEndDate,
      totalAmount,
    };
    setCartItems(updatedItems);

    try {
      const cartDocRef = doc(db, "users", user.uid, "cart", updatedItems[index].id);
      await setDoc(
        cartDocRef,
        {
          ...updatedItems[index],
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
          totalAmount,
        },
        { merge: true }
      );
      setPickerVisibility((prev) => ({
        ...prev,
        [updatedItems[index].id]: { showStartPicker: false, showEndPicker: false },
      }));
    } catch (error) {
      console.error("Error updating item dates in Firestore:", error);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to checkout.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const totalAmount = calculateTotalAmount();

    try {
      const orderDocRef = doc(collection(db, "users", user.uid, "orders"));
      const orderData = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          pricePerDay: item.pricePerDay,
          imageUrl: item.imageUrl,
          startDate: item.startDate.toISOString(),
          endDate: item.endDate.toISOString(),
          days: calculateDays(item),
          totalAmount: item.totalAmount,
        })),
        totalAmount,
        createdAt: serverTimestamp(),
      };
      await setDoc(orderDocRef, orderData);

      const cartRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartRef);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, "users", user.uid, "cart", docSnap.id));
      }

      navigation.navigate("Payment", { cartItems, totalAmount });
      setCartItems([]);
      setPickerVisibility({});
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      alert("Failed to process checkout. Please try again.");
    }
  };

  const renderCartItem = ({ item, index }) => {
    const itemVisibility = pickerVisibility[item.id] || {
      showStartPicker: false,
      showEndPicker: false,
    };

    return (
      <View style={styles.cartItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.cartImage} />
        <View style={styles.cartInfo}>
          <Text style={styles.cartName}>{item.name}</Text>
          <Text style={styles.cartPrice}>₹{item.pricePerDay}/day</Text>

          <View style={styles.datePickerContainer}>
            <View style={styles.datePicker}>
              <Text style={styles.dateLabel}>Start:</Text>
              <TouchableOpacity
                onPress={() =>
                  setPickerVisibility((prev) => ({
                    ...prev,
                    [item.id]: { ...prev[item.id], showStartPicker: true },
                  }))
                }
              >
                <Text style={styles.dateText}>{item.startDate.toDateString()}</Text>
              </TouchableOpacity>
              {itemVisibility.showStartPicker && (
                <DateTimePicker
                  value={item.startDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setPickerVisibility((prev) => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], showStartPicker: false },
                    }));
                    if (date) {
                      const newEndDate = date > item.endDate ? date : item.endDate;
                      updateItemDates(index, date, newEndDate);
                    }
                  }}
                />
              )}
            </View>
            <View style={styles.datePicker}>
              <Text style={styles.dateLabel}>End:</Text>
              <TouchableOpacity
                onPress={() =>
                  setPickerVisibility((prev) => ({
                    ...prev,
                    [item.id]: { ...prev[item.id], showEndPicker: true },
                  }))
                }
              >
                <Text style={styles.dateText}>{item.endDate.toDateString()}</Text>
              </TouchableOpacity>
              {itemVisibility.showEndPicker && (
                <DateTimePicker
                  value={item.endDate}
                  mode="date"
                  display="default"
                  minimumDate={item.startDate}
                  onChange={(event, date) => {
                    setPickerVisibility((prev) => ({
                      ...prev,
                      [item.id]: { ...prev[item.id], showEndPicker: false },
                    }));
                    if (date) updateItemDates(index, item.startDate, date);
                  }}
                />
              )}
            </View>
          </View>

          <Text style={styles.cartDays}>Days: {calculateDays(item)}</Text>
          <Text style={styles.cartTotal}>Total: ₹{item.totalAmount}</Text>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(index)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyCartText}>Please log in to view your cart.</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.checkoutText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
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
    marginVertical: 10,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#007bff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
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
