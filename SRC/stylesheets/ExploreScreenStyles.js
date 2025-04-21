import { StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  // 🎯 Category Buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryButton: {
    width: '30%',
    height: 85,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    marginBottom: 12,
  },
  selectedCategory: {
    backgroundColor: '#5C6BC0',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 5,
  },
  selectedCategoryText: {
    color: '#FFFFFF', // White text when category is selected
  },
  // 📦 Product Cards
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productContainer: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    alignItems: 'center',
  },
  productImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginTop: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#5C6BC0',
    fontWeight: '600',
    marginTop: 2,
  },
  dealText: {
    fontSize: 12,
    color: '#5C6BC0',
    fontWeight: '600',
    marginTop: 2,
  },
  // 🆕 Section Boxes (New Arrivals, Discounts, Deal of the Day)
  sectionBox: {
    width: width - 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  selectedSectionBox: {
    backgroundColor: '#5C6BC0',
  },
  sectionBoxTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  selectedSectionBoxTitle: {
    color: '#FFFFFF',
  },
  sectionBoxIcon: {
    width: 24,
    height: 24,
    tintColor: '#1A1A1A',
    marginRight: 8,
  },
  selectedSectionBoxIcon: {
    tintColor: '#FFFFFF',
  },
  // 🚀 Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});

export default styles;
