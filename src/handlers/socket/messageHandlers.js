/**
 * Setup Socket.io message-related event handlers
 * @param {Object} socket - Socket.io connection
 * @param {Function} setMessages - State setter for messages
 * @param {Function} setWaitingForResponse - State setter for waiting response flag
 */
const setupMessageHandlers = (
    socket,
    setMessages,
    setWaitingForResponse
  ) => {
    // Bot response received handler
    socket.on("bot_response", (newMessage) => {
      console.log("Bot response received:", newMessage);
  
      // Remove temporary waiting message and add the actual response
      setMessages((prevMessages) => {
        // Filter out any temporary "typing" messages
        const messagesWithoutTyping = prevMessages.filter(
          (msg) => !msg.isTyping
        );
        return [...messagesWithoutTyping, newMessage];
      });
  
      setWaitingForResponse(false);
    });
  
    // Message saved confirmation handler
    socket.on("message_saved", (message) => {
      console.log("Message saved confirmation:", message);
    });
  };
  
  export default setupMessageHandlers;