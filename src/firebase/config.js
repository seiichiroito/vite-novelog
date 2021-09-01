// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-X6q-DVJetBpqTLm1mCPPeK-uAR4c5Gg",
  authDomain: "novelog-275fb.firebaseapp.com",
  projectId: "novelog-275fb",
  storageBucket: "novelog-275fb.appspot.com",
  messagingSenderId: "574481485089",
  appId: "1:574481485089:web:226e260749361749768260",
  measurementId: "G-6K22HZZ61K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);
const actionCodeSettings = {
  url: "http://localhost:3000/",
  handleCodeInApp: true,
};

// Firestore
const db = getFirestore(app);

// Functions
const functions = getFunctions(app);

export { auth, actionCodeSettings, db, functions };
