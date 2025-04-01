<<<<<<< HEAD:SRC/HomeScreenStyles.js
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";
=======
import { StyleSheet, StatusBar, Platform } from "react-native";
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD:SRC/HomeScreenStyles.js
    backgroundColor: "#f5f5f5",
    padding: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 10 : 0, // Ensure fallback value
=======
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  /* 🔝 Header */
  header: {
    backgroundColor: "#FF4500",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js
  },


  /* 🔍 Search Bar */
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },

  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },

  /* 📦 Categories */
  categoriesWrapper: {
<<<<<<< HEAD:SRC/HomeScreenStyles.js
    backgroundColor: "#FFA500",
=======
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js
    padding: 15,
  },
  categoryBox: {
<<<<<<< HEAD:SRC/HomeScreenStyles.js
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 80,
    marginBottom: 10,
  },
  categoryText: {
    color: "#000000",
=======
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  categoryText: {
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js
    fontSize: 14,
    marginTop: 5,
  },

  /* 🏷️ Sections */
  sectionWrapper: {
<<<<<<< HEAD:SRC/HomeScreenStyles.js
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3, // ✅ Reduced from 100 to 3 (too high before)
=======
    padding: 15,
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gridWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#FF4500",
  },

  /* 🛒 Floating Cart */
  floatingCart: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 50,
  },

  /* 🔽 Bottom Navigation */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FF4500",
    padding: 15,
    justifyContent: "space-around",
<<<<<<< HEAD:SRC/HomeScreenStyles.js
    backgroundColor: "#FFA500",
    paddingVertical: 40, // Increase this value to push it down
    borderTopLeftRadius: 100,
    borderTopRightRadius:100,
    elevation: 5,
=======
>>>>>>> 071d3f212a95b1ca12fa995447118ff3a64438aa:SRC/stylesheets/HomeScreenStyles.js
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default styles;
