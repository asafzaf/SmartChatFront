function MessageList({ messages, currentUser, isNewChat }) {
  return (
    <div className="message-list">
      {messages.length === 0 || isNewChat ? (
        <div className="text-center text-gray-500 py-4">
          No messages yet. Start a conversation!
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`message ${
              msg.sender === currentUser.email ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              <strong>
                {msg.sender === currentUser.email
                  ? currentUser.first_name
                  : msg.sender}
                :
              </strong>{" "}
              {msg.text}
            </div>
            {/* <div className="message-timestamp text-xs text-gray-500">
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : ""}
            </div> */}
          </div>
        ))
      )}
    </div>
  );
}

export default MessageList;
