import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5C6BC0',
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#1E1E1E',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5C6BC0',
  },
  button: {
    width: width * 0.9,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  success: {
    color: '#008000',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;
