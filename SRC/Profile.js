// ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase_config"; // Import Firestore instance


const ProfileScreen = () => {
  return (
    <View>
      <Text>This is the Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;
