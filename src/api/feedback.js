import axios from "axios";
import { createHeaders } from "./api.conf";

export const sendFeedback = async (userId, chatId, feedback) => {
  try {
    if (!userId || !chatId || !feedback) {
      throw new Error("User ID, Chat ID, and feedback are required");
    }
    const headers = createHeaders();
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(userId, chatId, feedback);
    const response = await axios.post(
      `${apiUrl}/api/feedback`,
      {
        userId,
        chatId,
        feedback,
      },
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("An error occurred while sending feedback - ", error);
    throw error;
  }
};
