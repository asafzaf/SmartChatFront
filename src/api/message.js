import axios from "axios";

const apiUrl = process.env.apiUrl;

export const getMessages = async (chatId, userId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/${chatId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "An error occurred while fetching data to get messages - ",
      error
    );
    throw error;
  }
};

export const createNewMessage = async (userId, chatId, sender, text) => {
  // messageData is an object that contains the following properties:
  // - userId
  // - chatId
  // - sender
  // - text
  try {
    const response = await axios.post(`${apiUrl}/api/message/`, {
      userId,
      chatId,
      sender,
      text,
    });
    return response.data;
  } catch (error) {
    console.error(
      "An error occurred while fetching data to get messages - ",
      error
    );
    throw error;
  }
};
