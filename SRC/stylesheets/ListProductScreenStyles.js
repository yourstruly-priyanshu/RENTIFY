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
    fontWeight: 'bold',
    color: '#1E1E1E',
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
  },
  uploadButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#5C6BC0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
    color: '#1E1E1E',
  },
  button: {
    backgroundColor: '#5C6BC0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  notLoggedInText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1E1E1E',
    marginBottom: 10,
  },
  loginBox: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#5C6BC0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
