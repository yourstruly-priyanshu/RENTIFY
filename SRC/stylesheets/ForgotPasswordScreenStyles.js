import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B22222', // Dark red
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B22222', // Dark red
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFF', // White input field
    color: '#000', // Black text
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#B22222', // Red border
  },
  button: {
    width: width * 0.9,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF4D4D', // Vibrant red button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF', // White text
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
