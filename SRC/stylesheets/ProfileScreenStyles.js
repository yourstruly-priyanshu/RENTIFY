import { StyleSheet, Dimensions } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30, // Increased space below buttons
  },
  topButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 15,  // Increased vertical padding
    paddingHorizontal: 12,  // Increased horizontal padding
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
    elevation: 3, // Added shadow for a more professional look
  },
  topButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger font
  },
  profilePic: {
    width: 120,  // Increased size
    height: 120, // Increased size
    borderRadius: 60, // Keeps it round
    marginTop: 20, // Add a gap between the buttons and profile image
    marginBottom: 20,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  profileText: {
    fontSize: 45, // Increased font size for the placeholder text
    color: '#FFFFFF',
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15, // Increased padding for better touch experience
    marginBottom: 20, // Increased bottom margin for better spacing
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: 16, // Increased font size for readability
    elevation: 2, // Added subtle shadow for a more professional look
  },
  button: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 15,  // Increased vertical padding
    paddingHorizontal: 25, // Increased horizontal padding
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 20, // Added margin for spacing between profile fields
    elevation: 3, // Added shadow
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,  // Increased font size
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 15,  // Increased vertical padding
    paddingHorizontal: 25, // Increased horizontal padding
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, // Added shadow
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18, // Increased font size
  },
  loginBox: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 15, // Increased vertical padding
    paddingHorizontal: 20, // Increased horizontal padding
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Added shadow
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18, // Increased font size
  },
});
