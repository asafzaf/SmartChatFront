import { io } from "socket.io-client";
import setupConnectionHandlers from "./connectionHandlers.js";
import setupChatHandlers from "./chatHandlers.js";
import setupMessageHandlers from "./messageHandlers.js";

/**
 * Initialize and configure Socket.io connection
 * @param {string} userId - Current user ID
 * @param {Function} setLoadingMessages - State setter for loading messages
 * @param {Function} setChatList - State setter for chat list
 * @param {Function} setLoadingChatList - State setter for loading chat list
 * @param {Function} setMessages - State setter for messages
 * @param {Function} setSelectedChatId - State setter for selected chat ID
 * @param {Function} setIsNewChat - State setter for new chat flag
 * @param {Function} setWaitingForResponse - State setter for waiting response flag
 * @returns {Object} Socket.io connection object
 */
const initializeSocket = (
  userId,
  setLoadingMessages,
  setChatList,
  setLoadingChatList,
  setMessages,
  setSelectedChatId,
  setIsNewChat,
  setWaitingForResponse
) => {
  console.log("Initializing Socket.io connection...");
  console.log("User ID:", userId);
  const apiUrl = import.meta.env.VITE_API_URL;

  const socket = io(apiUrl, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Setup connection event handlers
  setupConnectionHandlers(socket, userId);

  // Setup chat event handlers
  setupChatHandlers(
    socket,
    userId,
    setChatList,
    setLoadingChatList,
    setSelectedChatId,
    setIsNewChat,
    setMessages
  );

  // Setup message event handlers
  setupMessageHandlers(socket, setChatList, setMessages, setWaitingForResponse);

  // Request initial chat list if user is authenticated
  if (userId) {
    socket.emit("request_chat_list", userId);
  }

  return socket;
};

/**
 * Join a chat room
 * @param {Object} socket - Socket.io connection
 * @param {string} chatId - Chat ID to join
 * @param {Function} setLoadingMessages - State setter for loading messages
 */
const joinChatRoom = (socket, chatId, setChatList, setLoadingMessages) => {
  if (!socket || !chatId) return;
  setLoadingMessages(true);

  try {
    socket.emit("join_room", chatId);
    console.log(`Joined room: ${chatId}`);
    setChatList((prevChatList) =>
      prevChatList.map((chat) =>
        chat._id === chatId ? { ...chat, hasNewMessages: false } : chat
      )
    );

    setLoadingMessages(false);
  } catch (err) {
    console.error("Error joining chat room:", err);
    setLoadingMessages(false);
  }
};

/**
 * Send a message in an existing chat
 * @param {Object} socket - Socket.io connection
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID
 * @param {string} message - Message text
 * @param {Function} setMessages - State setter for messages
 * @param {Function} setWaitingForResponse - State setter for waiting response flag
 */
const sendMessageToExistingChat = (
  socket,
  chatId,
  userId,
  message,
  setMessages,
  setWaitingForResponse
) => {
  if (!socket || !chatId) return;

  console.log("Sending message to existing chat:", chatId);

  // Add user message to UI immediately
  const userMessage = {
    chatId: chatId,
    sender: userId,
    text: message,
    timestamp: new Date(),
    isBot: false,
  };

  // Add temporary waiting message
  const waitingMessage = {
    chatId: chatId,
    sender: "bot",
    text: "I'm thinking...",
    timestamp: new Date(),
    isBot: true,
    isTyping: true,
  };

  setMessages((prevMessages) => [...prevMessages, userMessage, waitingMessage]);

  // Send message to the room
  socket.emit("send_message", {
    chatId: chatId,
    message: message,
  });

  setWaitingForResponse(true);
};

/**
 * Create a new chat
 * @param {Object} socket - Socket.io connection
 * @param {string} userId - User ID
 * @param {string} message - Initial message/prompt
 * @param {Function} setLoadingMessages - State setter for loading messages
 * @param {Function} setMessages - State setter for messages
 * @param {Function} setWaitingForResponse - State setter for waiting response flag
 */
const createNewChat = (
  socket,
  userId,
  message,
  subject,
  setLoadingMessages,
  setMessages,
  setWaitingForResponse
) => {
  if (!socket || !userId) return;

  console.log("Creating new chat...");
  setLoadingMessages(true);

  let data = {
    userId: userId,
    socketId: socket.id,
    prompt: message,
    subject,
  };

  socket.emit("create_chat", data);

  // Add user message to UI immediately for better UX
  const userMessage = {
    sender: userId,
    message: message,
    timestamp: new Date(),
    isBot: false,
  };

  // Add temporary waiting message
  const waitingMessage = {
    sender: "bot",
    message: "",
    timestamp: new Date(),
    isBot: true,
    isTyping: true,
  };

  setMessages([userMessage, waitingMessage]);
  setWaitingForResponse(true);
};

export {
  initializeSocket,
  joinChatRoom,
  sendMessageToExistingChat,
  createNewChat,
};
