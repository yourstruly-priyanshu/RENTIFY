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

const CartScreen = ({ navigation, route }) => {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  const removeFromCart = (index) => {
    setCartItems((prevItems) => {
      const updatedCart = [...prevItems];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigation.navigate("Payment", { cartItems });
    }
  };

  const renderCartItem = ({ item, index }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.cartImage} />
      <View style={styles.cartInfo}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartPrice}>₹{item.pricePerDay}/day</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(index)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderCartItem}
        />
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  cartPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default CartScreen;
