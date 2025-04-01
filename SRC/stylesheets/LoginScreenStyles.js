//styles
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFCCCB', // Light red background
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  imageContainer: {
    width: width * 0.6,
    height: height * 0.25,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for the image container
    borderRadius: 20,
    overflow: 'hidden', // Ensures the image is clipped to the container
    shadowColor: '#000', // Optional: Add shadow for better visibility
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
  },
  image: {
    width: '120%',
    height: '120%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B22222', // Dark red
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B22222', // Dark red
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#B22222', // Dark red
    marginBottom: 5,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White background for input
    color: '#000', // Black text
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#B22222', // Dark red border
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FF6347', // Tomato color for button
  },
  buttonText: {
    color: '#FFFFFF', // White text for button
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  link: {
    color: '#B22222', // Dark red
    marginTop: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default styles;
