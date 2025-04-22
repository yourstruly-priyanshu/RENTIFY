import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: '#5C6BC0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
  },
  button: {
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notLoggedInText: {
    fontSize: 16, // Changed to match ProfileScreen
    textAlign: 'center',
    color: '#E0E0E0', // Changed to match ProfileScreen
    marginBottom: 15, // Changed to match ProfileScreen
  },
  loginBox: {
    width: '100%', // Changed to match ProfileScreen
    padding: 20,
    borderRadius: 12, // Changed to match ProfileScreen
    backgroundColor: '#2A2A2A', // Changed to match ProfileScreen
    alignItems: 'center',
    marginTop: 50, // Added to match ProfileScreen
  },
  loginButton: {
    backgroundColor: '#D3D3D3', // Changed to match ProfileScreen
    paddingVertical: 12, // Changed to match ProfileScreen
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10, // Added to match ProfileScreen
    elevation: 2, // Changed to match ProfileScreen
  },
  loginButtonText: {
    color: '#000000', // Changed to match ProfileScreen
    fontWeight: '600', // Changed to match ProfileScreen
    fontSize: 16, // Changed to match ProfileScreen
  },
  goToLoginText: {
    fontSize: 16, // Changed to match ProfileScreen's text style
    textAlign: 'center',
    color: '#E0E0E0', // Changed to match ProfileScreen's notLoggedInText
    fontWeight: '600', // Changed to match ProfileScreen's buttonText
    marginVertical: 10, // Changed to match ProfileScreen's button spacing
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '90%',
    maxHeight: '50%',
    padding: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  categoryList: {
    width: '100%',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryText: {
    fontSize: 16,
    color: '#333333',
  },
  locationInputContainer: {
    width: '90%',
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationInput: {
    width: '80%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  locationIconButton: {
    width: '18%',
    height: 50,
    backgroundColor: '#5C6BC0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});