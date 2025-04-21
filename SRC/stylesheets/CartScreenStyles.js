import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cartImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartPrice: {
    fontSize: 14,
    color: "gray",
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 50,
  },
  checkoutButton: {
    backgroundColor: "#FF4500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginBox: {
    width: '90%', // Narrower width to avoid being "too big"
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2A2A2A', // Matches ProfileScreen
    alignItems: 'center',
    alignSelf: 'center', // Horizontal centering
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0', // Matches ProfileScreen
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#D3D3D3', // Matches ProfileScreen
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  loginButtonText: {
    color: '#000000', // Matches ProfileScreen
    fontSize: 16,
    fontWeight: '600',
  },
  goToLoginText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0', // Matches ProfileScreen's aesthetic
    fontWeight: '600',
    marginVertical: 10,
  },
});
