import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEX9MY3DXO0DVD2L6Qfz8aTCST3nMS3oE",
  authDomain: "taskmanagersacs.firebaseapp.com",
  projectId: "taskmanagersacs",
  storageBucket: "taskmanagersacs.firebasestorage.app",
  messagingSenderId: "579427013158",
  appId: "1:579427013158:web:454cf1e8797a1d79bf8ce7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth helper functions
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);