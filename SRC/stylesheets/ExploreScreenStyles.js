//styles
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  categoryButton: {
    width: 110,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FC6600',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    paddingVertical: 10,
  },
  selectedCategory: {
    backgroundColor: '#FFDDDD', // Slight light red when selected
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF0000',
    textAlign: 'center',
    marginTop: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productContainer: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    marginHorizontal: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FF0000',
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  productInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF0000',
    marginTop: 5,
  },
  discountText: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  dealText: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FC6600',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default styles;
