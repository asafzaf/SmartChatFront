import axios from "axios";
import { localConfig } from "./config.js";

const apiUrl = localConfig.apiUrl;

export const createNewChat = async (userId, prompt) => {
  try {
    const response = await axios.post(`${apiUrl}/api/chat`, { userId, prompt });
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
