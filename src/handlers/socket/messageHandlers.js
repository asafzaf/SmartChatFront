/**
 * Setup Socket.io message-related event handlers
 * @param {Object} socket - Socket.io connection
 * @param {Function} setMessages - State setter for messages
 * @param {Function} setWaitingForResponse - State setter for waiting response flag
 */
const setupMessageHandlers = (
  socket,
  setChatList,
  setMessages,
  setWaitingForResponse
) => {
  // Bot response received handler
  socket.on("bot_response", (data) => {
    let sameChat = false;

    const { chatId, botMessage, title } = data;

    // Remove temporary waiting message and add the actual response
    setMessages((prevMessages) => {
      // Filter out any temporary "typing" messages
      const messagesWithoutTyping = prevMessages.filter((msg) => !msg.isTyping);
      // Check if the chatId exists in the current messages
      const chatExists = messagesWithoutTyping.some(
        (msg) => msg.chatId === chatId
      );
      if (chatExists) {
        sameChat = true;
        // Check if the new message already exists in the previous messages
        if (!messagesWithoutTyping.some((msg) => msg._id === botMessage._id)) {
          return [...messagesWithoutTyping, botMessage];
        }
      }

      return messagesWithoutTyping;
    });

    if (!sameChat || title) {
      setChatList((prevChatList) =>
        prevChatList.map((chat) => {
          if (chat._id === chatId) {
            let updatedChat = { ...chat };
            if (!sameChat) updatedChat.hasNewMessages = true;
            if (title) updatedChat.title = title;
            return updatedChat;
          }
          return chat;
        })
      );
    }

    setWaitingForResponse(false);
  });
};

export default setupMessageHandlers;
