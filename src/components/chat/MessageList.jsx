import MessageComponent from "./MessageComponent";

function MessageList({ messages, currentUser, isNewChat }) {
  return (
    <div className="message-list">
      {messages.length === 0 || isNewChat ? (
        <div className="no-messages">
          No messages yet. Start a conversation!
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageComponent
            key={`${msg._id}-${index}`}
            message={msg}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
}

export default MessageList;
