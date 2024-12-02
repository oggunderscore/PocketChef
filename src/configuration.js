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
  apiKey: "AIzaSyBwlwlbJaPZnbAJahzJixfDty3TllgDPUo",
  authDomain: "pocket-chef-b12ca.firebaseapp.com",
  databaseURL: "https://pocket-chef-b12ca-default-rtdb.firebaseio.com/",
  projectId: "pocket-chef-b12ca",
  storageBucket: "pocket-chef-b12ca.firebasestorage.app",
  messagingSenderId: "360017427713",
  appId: "1:360017427713:web:748b842639ffefd6bcaf00",
  measurementId: "G-HGQF66LHMF"
  
  //apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  //databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  //projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  //storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  //messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  //appId: process.env.REACT_APP_FIREBASE_APP_ID,
  //measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
// const analytics = getAnalytics(app);
const auth = getAuth(app); // Add Firebase Authentication initialization

export { auth }; // Export auth if needed in other files
export const db = getFirestore(app);

// Export the initialized Firebase app
export default app;
