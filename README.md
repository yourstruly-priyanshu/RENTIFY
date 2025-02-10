# Rentify - Rental Marketplace App  
Rentify is a React Native-based rental marketplace where users can list, browse, and rent products. It integrates Firebase Authentication, Firestore Database, and Stripe/Razorpay for payments.  
## Features  
✔️ User Authentication – Login, Signup, and Forgot Password using Firebase Auth.  
✔️ Home Screen – Browse products with search and filtering.  
✔️ Product Listing – Users can list their own rental products.  
✔️ Product Page – View details, pricing, and contact the seller.  
✔️ Profile Management – Edit user details and access support.  
✔️ Chat Support – Users can ask queries in the feedback chat section.  
✔️ Payment Integration – Stripe/Razorpay for seamless transactions.  

## Tech Stack 
- Frontend: React Native, React Navigation  
- Backend: Firebase Authentication, Firestore Database  
- Payment Gateway: Stripe / Razorpay   


##  Installation & Setup 

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/your-username/rentify.git
cd rentify
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### 3️⃣ Setup Firebase 
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).  
2. Enable Authentication (Email/Password).  
3. Create a Firestore Database and set security rules.  
4. Add Firebase credentials in `firebase_config.js`:  

## 📲 Running the App  
### For Android/iOS 
```sh
npx expo start
```
or  
```sh
npx react-native run-android  # For Android
npx react-native run-ios      # For iOS (Mac required)
```

### For Web  
```sh
npm start
```
