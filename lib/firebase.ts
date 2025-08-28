// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARLxvsBWv5c0ClzpfTajCvTi3r9Fr0Fmc",
  authDomain: "challange-passabola.firebaseapp.com",
  databaseURL: "https://challange-passabola-default-rtdb.firebaseio.com",
  projectId: "challange-passabola",
  storageBucket: "challange-passabola.firebasestorage.app",
  messagingSenderId: "103354047603",
  appId: "1:103354047603:web:69f7c72a1e099efc51de06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
