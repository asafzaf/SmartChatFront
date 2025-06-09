/**
 * Setup Socket.io connection event handlers
 * @param {Object} socket - Socket.io connection
 * @param {string} userId - Current user ID
 */
const setupConnectionHandlers = (socket, userId) => {
  // Connection established handler
  socket.on("connect", () => {
    if (!socket.id) return; // Check if socket is connected

    socket.emit("identify_user", userId); // Send user ID to server
  });

  // Connection error handler
  socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error);
  });

  // Disconnection handler
  // socket.on("disconnect", (reason) => {
  //   console.log("Disconnected from Socket.io server. Reason:", reason);
  // });
};

export default setupConnectionHandlers;
