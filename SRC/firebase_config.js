// Import Firebase SDK
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 🔥 Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk2MiLZwF6tYpz7YwSXFfPSHgzFdHj9As",
  authDomain: "rentifypro837190.firebaseapp.com",
  projectId: "rentifypro837190",
  storageBucket: "rentifypro837190.appspot.com",  
  messagingSenderId: "55506909553",
  appId: "1:55506909553:web:165ab338085e5bf3661ed0",
  measurementId: "G-Z8DMVY8KX6",
};

// 🔹 Initialize Firebase (Check if it's already initialized)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);  // Initialize only if no apps are initialized
} else {
  app = getApp();  // Use the default app if already initialized
}

// 🔹 Initialize Firebase Auth
const auth = getAuth(app);

// 🔹 Initialize Firestore Database
const db = getFirestore(app);

// 🔹 Export auth and db to be used in other parts of the app
export { auth, db };

// Example usage of Firestore to add a new user (from signup)
const registerUser = async (email, password, userName) => {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Get user object after creation
    const user = userCredential.user;

    // Save additional user details to Firestore (e.g., userName)
    await setDoc(doc(db, "users", user.uid), {
      userName: userName,
      email: user.email,
      createdAt: new Date(),
    });

    console.log("User successfully created and saved in Firestore!");
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
};
