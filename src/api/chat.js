import axios from "axios";
import { basicConfig } from "./config.js";

const apiUrl = basicConfig.apiUrl;

export const createNewChat = async (userId, socketId, prompt) => {
  try {
    const response = await axios.post(`${apiUrl}/api/chat`, { userId, socketId, prompt });
    return response.data;
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw error;
  }
};

export const getChatList = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/chat/${userId}/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};
