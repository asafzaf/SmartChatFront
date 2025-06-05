import { useState } from "react";

function MessageInput({ onSend, isNewChat, waitingForResponse }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !waitingForResponse) {
      onSend(text);
      setText("");
    }
  };

  const inputPlaceholder = waitingForResponse
    ? "Waiting for response..."
    : "Type your message...";
  const submitButton = isNewChat ? "Start Chat" : "Send";

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        className="message-input"
        onChange={(e) => setText(e.target.value)}
        placeholder={inputPlaceholder}
        disabled={waitingForResponse}
      />
      <button
        type="submit"
        className={isNewChat ? "start-chat-btn" : "send-message-btn"}
        disabled={waitingForResponse}
      >
        {submitButton}
      </button>
    </form>
  );
}

export default MessageInput;
