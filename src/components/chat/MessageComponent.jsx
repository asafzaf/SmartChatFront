import React from "react";

const MessageComponent = ({ message, currentUser }) => {
  return (
    <div
      className={`message-${
        message.sender === currentUser._id ? "sent" : "received"
      }`}
    >
      <div className="message-content">
        <strong>
          {message.sender === currentUser._id
            ? currentUser.first_name
            : message.sender}
          :
        </strong>{" "}
        {message.text}
      </div>
      {/* <div className="message-timestamp text-xs text-gray-500">
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : ""}
            </div> */}
    </div>
  );
};

export default MessageComponent;
