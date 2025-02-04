import React from 'react';
import { StyleSheet, View } from 'react-native';
import Navigation from './SRC/Navigation.js';  // Import the Navigation component

export default function App() {
  return (
    <View style={styles.container}>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
