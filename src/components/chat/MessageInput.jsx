import { useState } from "react";

function MessageInput({ onSend, isNewChat, waitingForResponse }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const submitButton = isNewChat ? "Start Chat" : "Send";

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        className="message-input"
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit" className="send-message-btn">
        {submitButton}
      </button>
    </form>
  );
}

export default MessageInput;
