// File: "../../../../Feature/Firebase/FirebaseAuth.js"

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseApp from "./FirebaseConfig";

const auth = getAuth(firebaseApp);

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userData = {
      username: result.user.displayName,
      email: result.user.email,
      googleId: result.user.uid,
    };

    await saveUserDataToBackend(userData);

    return result.user;
  } catch (error) {
    throw error;
  }
};

const saveUserDataToBackend = async (userData) => {
  try {
    const response = await fetch("https://tangkas-jaya-taknik-api-v1.vercel.app/login-google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      console.log("User data saved successfully:", data);
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);
    } else {
      console.error("Failed to save user data:", data.error);
    }
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export default auth;
