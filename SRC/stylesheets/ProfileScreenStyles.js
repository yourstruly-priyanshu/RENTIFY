import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF', 
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', 
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FC6600', 
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF7F7F', // Light Red Placeholder
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    fontSize: 40,
    color: '#fff',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#FC6600', // Firebrick Red Border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFEEEE', 
  },
  button: {
    backgroundColor: '#FC6600', // Dark Red Button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FC6600', // Dark Red Button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FC6600', // Dark Red Border
  },
  logoutButtonText: {
    color: '#fff', // Dark Red Text
    fontSize: 16,
    fontWeight: 'bold',
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#8B0000', // Dark Red Text
    marginBottom: 10,
  },
  loginBox: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // White Background
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#FC6600', // Firebrick Red Button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
