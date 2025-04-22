import { StyleSheet, StatusBar, Platform, Dimensions } from "react-native";


const { width } = Dimensions.get("window");


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },


  /* 🔍 Search Bar */
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    margin: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
    color: "#777",
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },


  /* 📸 Banners */
  bannerContainer: {
    height: 150,
  },
  bannerImage: {
    width: width,
    height: 150,
    resizeMode: "cover",
    borderRadius: 12,
  },


  /* 🎁 Discount */
  discountImage: {
    width: width - 30,
    height: 100,
    alignSelf: "center",
    marginVertical: 12,
    borderRadius: 10,
  },


  /* 🧭 Categories */
  categoriesWrapper: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  categoryBox: {
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "#EEEEEE",
    padding: 10,
    borderRadius: 10,
    elevation: 1,
  },
  selectedCategory: {
    backgroundColor: "#5C6BC0",
  },
  categoryText: {
    fontSize: 13,
    marginTop: 5,
    color: "#333",
  },


  /* 🏷️ Section */
  sectionWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },


  /* 📦 Products */
  gridWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#5C6BC0",
    fontWeight: "bold",
  },


  /* 🛒 Cart */
  floatingCart: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#5C6BC0",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },


  /* 🧭 Footer Nav */
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 3,
  },
});


export default styles;





