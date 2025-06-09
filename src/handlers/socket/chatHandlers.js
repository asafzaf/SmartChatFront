/**
 * Setup Socket.io chat-related event handlers
 * @param {Object} socket - Socket.io connection
 * @param {string} userId - Current user ID
 * @param {Function} setChatList - State setter for chat list
 * @param {Function} setLoadingChatList - State setter for loading chat list
 * @param {Function} setSelectedChatId - State setter for selected chat ID
 * @param {Function} setIsNewChat - State setter for new chat flag
 * @param {Function} setMessages - State setter for messages
 */
const setupChatHandlers = (
  socket,
  userId,
  setChatList,
  setLoadingChatList,
  setSelectedChatId,
  setIsNewChat,
  setMessages
) => {
  // Chat list received handler
  socket.on("chat_list", (chats) => {
    setChatList(chats);
    setLoadingChatList(false);
  });

  // Chat history received handler
  socket.on("chat_history", (messages) => {
    if (messages.length === 1) {
      messages.push({
        chatId: messages[0].chatId,
        sender: "bot",
        text: "I'm thinking...",
        timestamp: new Date(),
        isBot: true,
        isTyping: true, // Special flag for waiting message
        gotFeedback: true, // Indicates this message is temporary
      });
    }
    setMessages(messages);
  });

  // New chat created handler
  socket.on("chat_created", (data) => {
    // Add new chat to chat list
    setChatList((prevChatList) => [...prevChatList, data.chat]);

    // Automatically select the new chat
    setSelectedChatId(data.chat._id);
    setIsNewChat(false);

    // Create initial messages
    const userMessage = {
      chatId: data.chat._id,
      sender: userId,
      message: data.chat.userPrompt,
      timestamp: new Date(),
      isBot: false,
    };

    // Add temporary waiting message
    const waitingMessage = {
      chatId: data.chat._id,
      sender: "bot",
      text: "I'm thinking...",
      timestamp: new Date(),
      isBot: true,
      isTyping: true, // Special flag for waiting message
      gotFeedback: true, // Indicates this message is temporary
    };

    setMessages([userMessage, waitingMessage]);
  });
};

export default setupChatHandlers;
