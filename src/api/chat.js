import axios from "axios";
import { createHeaders, getUserId } from "./api.conf";

export const getChatList = async (userId) => {
  try {
    // if (!userId) {
    //   throw new Error("User ID is required to fetch chat list");
    // }

    const userId = getUserId();
    if (!userId) {
      throw new Error("User ID is required to fetch chat list");
    }
    const headers = createHeaders();
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${apiUrl}/api/chat/${userId}/list`, {
      userId: userId,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    if (!chatId) {
      throw new Error("Chat ID is required to delete a chat");
    }
    const userId = getUserId();
    const headers = createHeaders();
    const apiUrl = import.meta.env.VITE_API_URL;
    const res = await axios.delete(`${apiUrl}/api/chat/${chatId}`, {
      data: { userId },
      headers: headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { error };
  }
};
