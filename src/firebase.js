// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk96R0nwrmit1tQy5KcswpoyLA2tPGKSA",
  authDomain: "randomfilm-3e0a8.firebaseapp.com",
  projectId: "randomfilm-3e0a8",
  storageBucket: "randomfilm-3e0a8.firebasestorage.app",
  messagingSenderId: "1002994670035",
  appId: "1:1002994670035:web:d2d750a58f386b1f1eb726"
  // measurementId не нужен для Firestore
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
