import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFDADA', // Light Red Background
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B0000', // Dark Red Text
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#B22222', // Firebrick Red Border
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
    borderColor: '#B22222', // Firebrick Red Border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFEEEE', // Very Light Red Input Background
  },
  button: {
    backgroundColor: '#8B0000', // Dark Red Button
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
    backgroundColor: '#B22222', // Firebrick Red Button
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
