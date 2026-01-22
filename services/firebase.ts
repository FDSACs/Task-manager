import firebase from 'firebase/app';
import 'firebase/auth';

/**
 * PASTE YOUR ACTUAL FIREBASE VALUES HERE
 * From: Firebase Console > Project Overview > + Add App > Web </>
 */
const firebaseConfig = {
  apiKey: "AIzaSyDEX9MY3DXO0DVD2L6Qfz8aTCST3nMS3oE",
  authDomain: "taskmanagersacs.firebaseapp.com",
  projectId: "taskmanagersacs",
  storageBucket: "taskmanagersacs.firebasestorage.app",
  messagingSenderId: "579427013158",
  appId: "1:579427013158:web:454cf1e8797a1d79bf8ce7"
};

// Fix: Initialize using the default firebase object
const app = firebase.initializeApp(firebaseConfig);
// Fix: Use instance methods and namespaced constructors
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const loginWithGoogle = () => auth.signInWithPopup(googleProvider);
export const logout = () => auth.signOut();