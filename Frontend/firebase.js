// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEKp2VwXCpSoeGTv4awAGPl1B02pqvIz0",
  authDomain: "birthday-reminder-f630c.firebaseapp.com",
  projectId: "birthday-reminder-f630c",
  storageBucket: "birthday-reminder-f630c.appspot.com",
  messagingSenderId: "155265812963",
  appId: "1:155265812963:web:f0c4caa8921ec1d22238d6",
  measurementId: "G-PXEDMX1T6F"
};

// Initialize Firebase app and authentication service
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign up function
export const handleSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    throw error;
  }
};

// Login function
export const handleLogin = async (email, password, rememberMe) => {
  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Password reset function
export const handleForgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw new Error("Failed to send password reset email. Please try again.");
  }
};

// Authentication state listener (useful for detecting login status changes)
export const checkAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Export the auth object for use elsewhere in your app
export { auth };
