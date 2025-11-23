import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ4qAlUkZ6CiuYj8g9CHqs2EYmJNY_Yuc",
  authDomain: "los-mas-chiludos.firebaseapp.com",
  projectId: "los-mas-chiludos",
  storageBucket: "los-mas-chiludos.firebasestorage.app",
  messagingSenderId: "371965545877",
  appId: "1:371965545877:web:2050bd3033f8fdfc663a9c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
