function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
