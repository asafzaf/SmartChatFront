import axios from "axios";

export const sendFeedback = async (userId, chatId, feedback) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log(userId, chatId, feedback);
    const response = await axios.post(`${apiUrl}/api/feedback`, {
      userId,
      chatId,
      feedback,
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred while sending feedback - ", error);
    throw error;
  }
};