import MessageComponent from "./MessageComponent";
import LoadingSpinner from "../general/LoadingSpinner";

function MessageList({ messages, currentUser, loading, isNewChat }) {
  return (
    <div className="message-list">
      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 || isNewChat ? (
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
