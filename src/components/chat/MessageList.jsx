import { useEffect, useRef } from "react";
import MessageComponent from "./MessageComponent";
import LoadingSpinner from "../general/LoadingSpinner";

function MessageList({ messages, currentUser, loading, isNewChat }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="message-list">
      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 || isNewChat ? (
        <div className="no-messages">
          No messages yet. Start a conversation!
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageComponent
              key={`${msg._id}-${index}`}
              message={msg}
              currentUser={currentUser}
            />
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}

export default MessageList;
