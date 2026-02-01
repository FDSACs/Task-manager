import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  RecaptchaVerifier, // Added for SMS security
  signInWithPhoneNumber // Added for SMS sending
} from "firebase/auth";

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

// Google Auth helper functions
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

/** * SMS OTP Helper Functions 
 **/

// This sets up the invisible security check required by Google for SMS
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    'callback': () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    }
  });
};

// This sends the actual SMS to the user's phone
export const sendOtp = (phoneNumber: string, appVerifier: any) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};