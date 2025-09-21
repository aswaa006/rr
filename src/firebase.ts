// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBV49nG7gxPX_wJvw3enlqAMqnTq00eV8w",
  authDomain: "online-voting-68d58.firebaseapp.com",
  projectId: "online-voting-68d58",
  storageBucket: "online-voting-68d58.firebasestorage.app",
  messagingSenderId: "950168996490",
  appId: "1:950168996490:web:0c66f8572bc64199f73b73",
  measurementId: "G-0861YL98GD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (role: "user" | "driver") => {
  try {
    console.log("Starting Google authentication...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Authentication successful:", user);

    const userData = { 
      email: user.email, 
      name: user.displayName, 
      photo: user.photoURL, 
      role 
    };

    localStorage.setItem("user", JSON.stringify(userData));
    console.log("User data saved to localStorage");

    // Navigate to book ride page after successful login
    window.location.href = "/book-ride";
  } catch (err: any) {
    console.error("Google Auth Error:", err);
    
    // Show specific error messages
    if (err.code === 'auth/popup-closed-by-user') {
      alert('Sign-in was cancelled. Please try again.');
    } else if (err.code === 'auth/popup-blocked') {
      alert('Popup was blocked by browser. Please allow popups and try again.');
    } else if (err.code === 'auth/unauthorized-domain') {
      alert('This domain is not authorized. Please contact support.');
    } else if (err.code === 'auth/operation-not-allowed') {
      alert('Google sign-in is not enabled. Please contact support.');
    } else {
      alert(`Authentication failed: ${err.message || 'Unknown error'}`);
    }
  }
};

export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("user");
  window.location.href = "/";
};
