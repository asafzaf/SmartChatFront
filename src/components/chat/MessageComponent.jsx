import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageComponent = ({ message, currentUser }) => {
  console.log("MessageComponent", message); // TBD

  return (
    <div
      className={`message-${
        message.sender === currentUser._id ? "sent" : "received"
      }`}
    >
      {/* <strong>
        {message.sender === currentUser._id ? "Me" : message.sender}:
      </strong> */}
      <div className="message-content">
        {message.sender === currentUser._id ? (
          message.text
        ) : (
          <div className="bot-message">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
