import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPsNMmGBkJYwCS-cSUXEt-vEomtPjqw4Q",
  authDomain: "prewise-cba3d.firebaseapp.com",
  projectId: "prewise-cba3d",
  storageBucket: "prewise-cba3d.firebasestorage.app",
  messagingSenderId: "834528633258",
  appId: "1:834528633258:web:75dc2e39f292215a138bd3",
  measurementId: "G-SSKF6P6W08"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

