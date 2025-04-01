//styles
import { StyleSheet, StatusBar, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 15,
  },
  categoryBox: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    marginTop: 5,
  },

  /* 🏷️ Sections */
  sectionWrapper: {
    padding: 15,
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
