import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 10 : 0, // Ensure fallback value
  },


  /* 🔍 Search Bar */
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },

  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },

  /* 📦 Categories Section */
  categoriesWrapper: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  categoryBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 80,
    marginBottom: 10,
  },
  categoryText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "bold",
  },

  /* 🔥 Popular Items & Recommendations */
  sectionWrapper: {
    backgroundColor: "#FFA500",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3, // ✅ Reduced from 100 to 3 (too high before)
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
    alignItems: "center",
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
  },

  /* 🛒 Cart Icon */
  cartIconContainer: {
    position: "relative",
    padding: 10,
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  /* 🔽 Bottom Navigation */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFA500",
    paddingVertical: 40, // Increase this value to push it down
    borderTopLeftRadius: 100,
    borderTopRightRadius:100,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default styles;
