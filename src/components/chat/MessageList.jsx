function MessageList({ messages, currentUser }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {console.log(msg)}
          <strong>{currentUser.first_name}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
