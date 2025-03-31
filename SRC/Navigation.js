import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import ProductScreen from "./ProductScreen";
import PaymentScreen from "./PaymentScreen";
import ProfileScreen from "./ProfileScreen";
import ListProductScreen from "./ListProductScreen";
import ExploreScreen from "./ExploreScreen";
import ChatScreen from "./ChatScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import CartScreen from "./CartScreen"; // ✅ Import CartScreen

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Product" component={ProductScreen} options={{ title: "Product Details" }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
        <Stack.Screen name="Explore" component={ExploreScreen} options={{ title: "Explore" }} />
        <Stack.Screen name="ListProduct" component={ListProductScreen} options={{ title: "List Product" }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Chat" }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ title: "Sign Up" }} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ title: "Forgot Password" }} />
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: "Cart" }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
