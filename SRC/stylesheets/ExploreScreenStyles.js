import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },

  // 🎯 Category Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    width: '30%',
    height: 90,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#5C6BC0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 12,
  },
  selectedCategory: {
    backgroundColor: '#EDEBFA',
    borderColor: '#5C6BC0',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: 6,
  },

  // 📦 Product Cards
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productContainer: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#5C6BC0',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  productInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginTop: 4,
  },
  discountText: {
    fontSize: 13,
    color: '#5C6BC0',
    fontWeight: '600',
    marginTop: 2,
  },
  dealText: {
    fontSize: 13,
    color: '#5C6BC0',
    fontWeight: '600',
    marginTop: 2,
  },

  // 🚀 Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5C6BC0',
    padding: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});

export default styles;
