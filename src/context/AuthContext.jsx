// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

import { signIn, signUp } from "../api/auth"; // Import your API functions here
import { updateUser } from "../api/user";

// Create the context
export const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when app loads
    const checkAuthStatus = async () => {
      try {
        // Replace this with your actual authentication check
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Replace with your actual API call
      // const response = await api.post('/login', { email, password });
      // const userData = response.data;

      const userData = await signIn(email, password);
      if (!userData) {
        throw new Error("Login failed");
      }

      //   // Simulate successful login for now
      //   const userData = { email, id: Date.now().toString() };

      // Store in localStorage and context
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.response.data.message || "Login failed" };
    }
  };

  // Signup function - now accepts full userData object
  const signup = async (userData) => {
    try {
      // Replace with your actual API call
      // const response = await api.post('/signup', userData);
      // const returnedUserData = response.data;

      const returnedUserData = await signUp(userData);
      if (!returnedUserData) {
        throw new Error("Signup failed");
      }

      //   // Simulate successful signup for now
      //   const returnedUserData = {
      //     ...userData,
      //     id: Date.now().toString(),
      //     // Remove password from local storage for security
      //     password: undefined
      //   };

      // Store in localStorage and context
      localStorage.setItem("user", JSON.stringify(returnedUserData));
      setCurrentUser(returnedUserData);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return { success: false, error: error.response.data.message || "Signup failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Update user function
  const syncUpdateUser = async (newUserData, userId) => {
    try {
      // Replace with your actual API call
      // const response = await api.put('/updateUser', userData);
      // const updatedUserData = response.data;

      const updatedUserData = await updateUser(newUserData, userId); // Assuming signUp is used for updating as well
      if (!updatedUserData) {
        throw new Error("Update failed");
      }

      // Store in localStorage and context
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      setCurrentUser(updatedUserData);
      window.location.reload();
      return { success: true };
    } catch (error) {
      console.error("Update failed:", error);
      return { success: false, error: error.message || "Update failed" };
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    syncUpdateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
