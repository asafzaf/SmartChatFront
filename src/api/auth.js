import axios from "axios";
import { basicConfig } from "./config.js";

const apiUrl = basicConfig.apiUrl;

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};