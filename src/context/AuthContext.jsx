import { createContext, useState, useEffect, useContext } from "react";

import { signIn, signUp } from "../api/auth";
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
      const userData = await signIn(email, password);
      if (!userData) {
        throw new Error("Login failed");
      }

      // Store in localStorage and context
      localStorage.setItem("user", JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.response.data.message || "Login failed",
      };
    }
  };

  // Signup function - now accepts full userData object
  const signup = async (userData) => {
    try {
      const returnedUserData = await signUp(userData);
      if (!returnedUserData) {
        throw new Error("Signup failed");
      }

      // Store in localStorage and context
      localStorage.setItem("user", JSON.stringify(returnedUserData));
      setCurrentUser(returnedUserData);
      return { success: true };
    } catch (error) {
      console.error("Signup failed:", error);
      return {
        success: false,
        error: error.response.data.message || "Signup failed",
      };
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
      const updatedUserData = await updateUser(newUserData, userId);
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
