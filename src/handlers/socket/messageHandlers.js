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

    const { chatId, botMessage, title } = data;
    console.log("Bot response received:", botMessage);
    console.log("ChatId: ", chatId);
    console.log("Title: ", title);

    // Remove temporary waiting message and add the actual response
    setMessages((prevMessages) => {
      // Filter out any temporary "typing" messages
      const messagesWithoutTyping = prevMessages.filter((msg) => !msg.isTyping);
      console.log("Current messages without typing:", messagesWithoutTyping);
      // Check if the chatId exists in the current messages
      const chatExists = messagesWithoutTyping.some(
        (msg) => msg.chatId === chatId
      );
      console.log("Chat exists in current messages:", chatExists);
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

    if (!sameChat || title) {
      console.log("## Updating chat list for new messages or title");
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

  // Message saved confirmation handler
  socket.on("message_saved", (message) => {
    console.log("Message saved confirmation:", message);
  });
};

export default setupMessageHandlers;
