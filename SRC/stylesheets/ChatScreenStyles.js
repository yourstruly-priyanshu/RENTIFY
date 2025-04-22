import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  messageList: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    fontSize: 16,
    color: '#333333',
  },
  sendButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  systemMessage: {
    backgroundColor: '#E0E0E0', // Lighter grey for readability
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#ADD8E6',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#5C6BC0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#333333', // Darker text for contrast
    fontSize: 16,
  },
  // Not logged-in section (aligned with ListProductScreenStyles.js)
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9', // Matches container background from reference
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  loginBox: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2A2A2A', // Dark container from reference
    alignItems: 'center',
    marginTop: 50,
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  loginButton: {
    backgroundColor: '#D3D3D3', // Light grey button from reference
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 2,
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});