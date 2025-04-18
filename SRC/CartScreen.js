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
import DatePicker from "react-native-date-picker";
import { db } from "./firebase_config";
import {
 collection,
 addDoc,
 getDocs,
 deleteDoc,
 doc,
 serverTimestamp,
 setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const CartScreen = ({ navigation, route }) => {
 const [cartItems, setCartItems] = useState([]);
 const [user, setUser] = useState(null);


 // Initialize auth and listen for user state
 useEffect(() => {
   const auth = getAuth();
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
   });
   return () => unsubscribe();
 }, []);


 // Load cart from Firestore
 useEffect(() => {
   if (!user) {
     setCartItems([]);
     return;
   }


   const fetchCart = async () => {
     try {
       const cartRef = collection(db, "users", user.uid, "cart");
       const snapshot = await getDocs(cartRef);
       const cartData = snapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
         startDate: doc.data().startDate ? new Date(doc.data().startDate) : new Date(),
         endDate: doc.data().endDate ? new Date(doc.data().endDate) : new Date(),
       }));
       setCartItems(cartData);
     } catch (error) {
       console.error("Error fetching cart:", error);
     }
   };


   fetchCart();
 }, [user]);


 // Calculate days for a single item
 const calculateDays = (item) => {
   const diffTime = Math.abs(item.endDate - item.startDate);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   return diffDays > 0 ? diffDays : 1;
 };


 // Calculate total amount for all items
 const calculateTotalAmount = () => {
   return cartItems.reduce((total, item) => total + item.pricePerDay * calculateDays(item), 0);
 };


 // Remove item from cart and Firestore
 const removeFromCart = async (index) => {
   if (!user) return;


   const itemId = cartItems[index].id;
   try {
     const cartDocRef = doc(db, "users", user.uid, "cart", itemId);
     await deleteDoc(cartDocRef);
     setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
   } catch (error) {
     console.error("Error removing item from Firestore:", error);
   }
 };


 // Update item dates
 const updateItemDates = async (index, newStartDate, newEndDate) => {
   if (!user) return;


   const updatedItems = [...cartItems];
   updatedItems[index] = {
     ...updatedItems[index],
     startDate: newStartDate,
     endDate: newEndDate,
   };
   setCartItems(updatedItems);


   try {
     const cartDocRef = doc(db, "users", user.uid, "cart", updatedItems[index].id);
     await setDoc(cartDocRef, {
       ...updatedItems[index],
       startDate: newStartDate.toISOString(),
       endDate: newEndDate.toISOString(),
     }, { merge: true });
   } catch (error) {
     console.error("Error updating item dates in Firestore:", error);
   }
 };


 // Handle checkout
 const handleCheckout = async () => {
   if (!user) {
     alert("Please log in to checkout.");
     return;
   }


   if (cartItems.length > 0) {
     const totalAmount = calculateTotalAmount();


     // Save order to Firestore
     try {
       const orderDocRef = doc(db, "users", user.uid, "orders", user.uid);
       const orderData = {
         items: cartItems.map((item) => ({
           id: item.id,
           name: item.name,
           pricePerDay: item.pricePerDay,
           imageUrl: item.imageUrl,
           startDate: item.startDate.toISOString(),
           endDate: item.endDate.toISOString(),
           days: calculateDays(item),
         })),
         totalAmount,
         createdAt: serverTimestamp(),
       };
       await setDoc(orderDocRef, orderData, { merge: true });


       // Clear cart
       const cartRef = collection(db, "users", user.uid, "cart");
       const snapshot = await getDocs(cartRef);
       for (const docSnap of snapshot.docs) {
         await deleteDoc(doc(db, "users", user.uid, "cart", docSnap.id));
       }


       navigation.navigate("Payment", { cartItems, totalAmount });
       setCartItems([]);
     } catch (error) {
       console.error("Error saving order to Firestore:", error);
     }
   }
 };


 const renderCartItem = ({ item, index }) => (
   <View style={styles.cartItem}>
     <Image source={{ uri: item.imageUrl }} style={styles.cartImage} />
     <View style={styles.cartInfo}>
       <Text style={styles.cartName}>{item.name}</Text>
       <Text style={styles.cartPrice}>₹{item.pricePerDay}/day</Text>


       {/* Date Pickers for Each Item */}
       <View style={styles.datePickerContainer}>
         <View style={styles.datePicker}>
           <Text style={styles.dateLabel}>Start:</Text>
           <TouchableOpacity onPress={() => {
             const updatedItems = [...cartItems];
             updatedItems[index].openStartPicker = true;
             setCartItems(updatedItems);
           }}>
             <Text style={styles.dateText}>{item.startDate.toDateString()}</Text>
           </TouchableOpacity>
           <DatePicker
             modal
             open={item.openStartPicker || false}
             date={item.startDate}
             onConfirm={(date) => {
               const updatedItems = [...cartItems];
               updatedItems[index].openStartPicker = false;
               const newEndDate = date > item.endDate ? date : item.endDate;
               updateItemDates(index, date, newEndDate);
             }}
             onCancel={() => {
               const updatedItems = [...cartItems];
               updatedItems[index].openStartPicker = false;
               setCartItems(updatedItems);
             }}
             minimumDate={new Date()}
           />
         </View>
         <View style={styles.datePicker}>
           <Text style={styles.dateLabel}>End:</Text>
           <TouchableOpacity onPress={() => {
             const updatedItems = [...cartItems];
             updatedItems[index].openEndPicker = true;
             setCartItems(updatedItems);
           }}>
             <Text style={styles.dateText}>{item.endDate.toDateString()}</Text>
           </TouchableOpacity>
           <DatePicker
             modal
             open={item.openEndPicker || false}
             date={item.endDate}
             onConfirm={(date) => {
               const updatedItems = [...cartItems];
               updatedItems[index].openEndPicker = false;
               updateItemDates(index, item.startDate, date);
             }}
             onCancel={() => {
               const updatedItems = [...cartItems];
               updatedItems[index].openEndPicker = false;
               setCartItems(updatedItems);
             }}
             minimumDate={item.startDate}
           />
         </View>
       </View>


       <Text style={styles.cartDays}>Days: {calculateDays(item)}</Text>
       <Text style={styles.cartTotal}>
         Total: ₹{item.pricePerDay * calculateDays(item)}
       </Text>
     </View>
     <TouchableOpacity onPress={() => removeFromCart(index)}>
       <Icon name="trash" size={24} color="red" />
     </TouchableOpacity>
   </View>
 );


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



