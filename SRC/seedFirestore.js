import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase_config.js"; // Ensure this points to your Firestore instance

const rentalProducts = [
  {
    name: "Canon EOS R5",
    category: "Camera",
    pricePerDay: 50,
    imageUrl: "https://in.canon/media/image/2020/07/04/862a1f43feed4fab85897aee45b6324c_R5_Front_BODY.png",
    description: "High-end mirrorless camera with 8K video recording.",
    location: "Kolkata, India",
    available: true
  },
  {
    name: "Yamaha R15",
    category: "Motorbike",
    pricePerDay: 30,
    imageUrl: "https://shop.yamaha-motor-india.com/cdn/shop/products/Black_720x720.webp?v=1680862102",
    description: "A sporty bike perfect for city rides.",
    location: "Jabalpur, India",
    available: true
  },
  {
    name: "Tesla Model 3",
    category: "Car",
    pricePerDay: 100,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJcdk4fJGId8OzC5CPn44ukPkoiWJTMFnOEg&s",
    description: "Electric car with autopilot features.",
    location: "USA",
    available: false
  },
  {
    name: "DJI Mavic Air 2",
    category: "Drone",
    pricePerDay: 40,
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2021/9/ZA/TY/UV/135768661/mavic-air2-dji-drone-camera.jpg",
    description: "Compact drone with 4K video recording.",
    location: "Lucknow, India",
    available: true
  },
  {
    name: "MacBook Pro M2",
    category: "Laptop",
    pricePerDay: 60,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6PRncf0cSUfaMPOb-CCDl6FRcyubHfC56BA&s",
    description: "Powerful laptop for professional use.",
    location: "Delhi, India",
    available: true
  }
];

const uploadData = async () => {
  try {
    const collectionRef = collection(db, "rentalProducts");
    for (const product of rentalProducts) {
      await addDoc(collectionRef, product);
      console.log(`Uploaded: ${product.name}`);
    }
    console.log("Data successfully uploaded!");
  } catch (error) {
    console.error("Error uploading data: ", error);
  }
};

// Run upload function
uploadData().then(() => console.log("Upload completed!"));
