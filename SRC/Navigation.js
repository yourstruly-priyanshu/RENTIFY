import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import HomeScreen from "./HomeScreen";
import ProductScreen from "./ProductScreen";
import PaymentScreen from "./PaymentScreen";
import ProfileScreen from "./ProfileScreen"; 
import ListProductScreen from "./ListProductScreen"; 
import ExploreScreen from "./ExploreScreen"; 
import ChatScreen from "./ChatScreen"; 
import { ActivityIndicator, View, StyleSheet } from "react-native"; // Import ActivityIndicator

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user: ", error);
      setLoading(false); // Stop loading on error
    });
    return unsubscribe; // Clean up the listener when component unmounts
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" /> {/* Loading indicator */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {user ? (
          // If logged in, show Home and App Screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Product" component={ProductScreen} options={{ title: "Product Details" }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
            <Stack.Screen name="Explore" component={ExploreScreen} options={{ title: "Explore" }} />
            <Stack.Screen name="ListProduct" component={ListProductScreen} options={{ title: "List Product" }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
          </>
        ) : (
          // If logged out, show Authentication Screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Reset Password" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
