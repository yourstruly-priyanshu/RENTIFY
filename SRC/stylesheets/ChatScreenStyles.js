import { StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: '#5C6BC0',
  },
  aiMessage: {
    backgroundColor: '#EEEEEE',
  },
  systemMessage: {
    backgroundColor: '#000',
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#5C6BC0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    elevation: 3,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1A1A1A',
    fontWeight: '600',
    marginBottom: 12,
  },
  loginBox: {
    width: width - 30,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
    alignSelf: 'center',
  },
  loginButton: {
    backgroundColor: '#5C6BC0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
