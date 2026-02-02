import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,        // Added: To give SMS users a name
  linkWithPhoneNumber,  // Added: To connect Phone to a Google account
  PhoneAuthProvider     // Added: To handle credentials for linking
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEX9MY3DXO0DVD2L6Qfz8aTCST3nMS3oE",
  authDomain: "taskmanagersacs.firebaseapp.com",
  projectId: "taskmanagersacs",
  storageBucket: "taskmanagersacs.firebasestorage.app",
  messagingSenderId: "579427013158",
  appId: "1:579427013158:web:454cf1e8797a1d79bf8ce7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// --- Existing Helpers ---
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// --- SMS OTP Helpers ---
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible'
  });
};

export const sendOtp = (phoneNumber: string, appVerifier: any) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// --- New Profile & Linking Helpers ---

/**
 * Updates the current user's name (useful for SMS users)
 */
export const updateUserProfile = (displayName: string) => {
  if (!auth.currentUser) return Promise.reject("No user logged in");
  return updateProfile(auth.currentUser, { displayName });
};

/**
 * Links a phone number to an already logged-in Google user
 */
export const linkPhoneToAccount = (phoneNumber: string, appVerifier: any) => {
  if (!auth.currentUser) return Promise.reject("No user logged in");
  return linkWithPhoneNumber(auth.currentUser, phoneNumber, appVerifier);
};