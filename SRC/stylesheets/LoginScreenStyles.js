import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D3D3D3', // Changed to grey for login screen
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: '120%',
    height: '120%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#1E1E1E',
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#1E1E1E',
    marginBottom: 5,
  },
  input: {
    width: width * 0.89,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#1E1E1E',
    borderColor: '#5C6BC0',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#5C6BC0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#5C6BC0', // Default color for regular buttons
  },
  googleButton: {
    width: '100%',
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#5C6BC0',
    borderRadius: 10,
    alignItems: 'center',
    // Multi-color changing will be handled via state/animation (see component comment)
    backgroundColor: '#DB4437', // Default Google red as starting color
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  link: {
    color: '#5C6BC0',
    marginTop: 15,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default styles;