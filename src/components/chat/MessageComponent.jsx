import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageComponent = ({
  message,
  currentUser,
  handleOpenForm,
  index,
  feedbackGivenMessages,
}) => {
  const hasGivenFeedback = feedbackGivenMessages.includes(message._id);
  return (
    <div
      className={`message-${
        message.sender === currentUser._id ? "sent" : "received"
      }`}
    >
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

        {index % 2 === 1 && !hasGivenFeedback && (
          <button
            className="open-form-btn"
            onClick={() => handleOpenForm(message)}
          >
            Want to Share Feedback?
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
