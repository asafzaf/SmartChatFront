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
    console.log("Bot response event received:", data);

    let sameChat = false;

    const { chatId, botMessage } = data;
    console.log("Bot response received:", botMessage);
    console.log("ChatId: ", chatId);

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
          console.log("Adding new message:", botMessage);
          return [...messagesWithoutTyping, botMessage];
        }
        console.log("Message already exists, not adding:", botMessage);
      } else {
        console.log(
          "Currently not on the specific chat, ignoring message:",
          chatId
        );
      }

      return messagesWithoutTyping;
    });

    if (!sameChat) {
      // If the chatId doesn't exist in the current messages, update the chat list
      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat._id === chatId ? { ...chat, hasNewMessages: true } : chat
        )
      );
    }

    setWaitingForResponse(false);
  });

  // Message saved confirmation handler
  socket.on("message_saved", (message) => {
    console.log("Message saved confirmation:", message);
  });
};

export default setupMessageHandlers;
