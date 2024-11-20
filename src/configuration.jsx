// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzz0eVRMZQrZXZwVK9TKgNI_wtMn7_Fdk",
  authDomain: "pocket-chef-b12ca.firebaseapp.com",
  databaseURL: "https://pocket-chef-b12ca-default-rtdb.firebaseio.com",
  projectId: "pocket-chef-b12ca",
  storageBucket: "pocket-chef-b12ca.appspot.com",
  messagingSenderId: "360017427713",
  appId: "1:360017427713:web:3d457eaadf8f5861bcaf00",
  measurementId: "G-V1F8YZBHH1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const auth = getAuth(app); // Add Firebase Authentication initialization

export { auth }; // Export auth if needed in other files
export const db = getFirestore(app);

// Export the initialized Firebase app
export default app;
