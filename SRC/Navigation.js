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
import ListProduct from "./ListProductScreen";

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
to       setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // Clean up the listener when component unmounts
  }, []);

  if (loading) return null; // Prevent flickering by waiting for auth state

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {user ? (
          // If logged in, show Home and App Screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Product" component={ProductScreen} options={{ title: "Product Details" }} />
            <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
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
