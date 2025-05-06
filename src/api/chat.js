import axios from "axios";
import { basicConfig } from "../../etc/secrets/config.js";

const apiUrl = basicConfig.apiUrl;

export const createNewChat = async (userId, socketId, prompt) => {
  try {
    const response = await axios.post(`${apiUrl}/api/chat`, {
      userId,
      socketId,
      prompt,
    });
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

export const deleteChat = async (chatId) => {
  try {
    console.log("Enter chat deleting");
    const res = await axios.delete(`${apiUrl}/api/chat/${chatId}`);
    console.log("deleting chat:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { error };
  }
};
