import React from "react";
import dummyMessage from "../../Data/dummyMessage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageComponent = ({ message, currentUser }) => {
  console.log("MessageComponent", message); // TBD

  // const dumMessage = {
  //   sender: "AI-System",
  //   text: dummyMessage,
  // };

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
        {message.text}
        {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {dumMessage.text}
        </ReactMarkdown> */}
      </div>
    </div>
  );
};

export default MessageComponent;
