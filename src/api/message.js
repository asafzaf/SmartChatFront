import axios from "axios";
import { createHeaders } from "./api.conf";

// to be deleted
export const markMessageFeedbackGiven = async (messageId) => {
  try {
    if (!messageId) {
      throw new Error("Message ID is required to mark feedback as given");
    }
    const headers = createHeaders();
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.put(
      `${apiUrl}/api/message/${messageId}`,
      {},
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to mark message feedback given:", error);
    throw error;
  }
};
