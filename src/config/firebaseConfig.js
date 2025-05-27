// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKJiOzHcZLXjGL5wKKVGKLEllw7zuljA0",
  authDomain: "softlink-chat.firebaseapp.com",
  projectId: "softlink-chat",
  storageBucket: "softlink-chat.appspot.com",
  messagingSenderId: "411866506552",
  appId: "1:411866506552:web:ca612f68c053532b46cdcd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
