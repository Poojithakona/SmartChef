import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaxGMqbYYRUUkTfuN1mMsDWFbfMZHcoD0",
  authDomain: "smartchef-dcc2b.firebaseapp.com",
  projectId: "smartchef-dcc2b",
  storageBucket: "smartchef-dcc2b.firebasestorage.app",
  messagingSenderId: "628056888454",
  appId: "1:628056888454:web:146a5ce5b53d3e7c976d07",
  measurementId: "G-YQBDEB4CR1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
