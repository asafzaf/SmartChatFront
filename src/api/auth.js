import axios from "axios";

const apiUrl = process.env.API_URL;

export const signUp = async (userData) => {
  try {
    const response = await axios.post(apiUrl+`/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(apiUrl+`/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};