function ChatList({
  onSelectChat,
  selectedChatId,
  onCreateChat,
  chats,
  loading,
}) {
  return (
    <div className="chat-list">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button onClick={onCreateChat} className="new-chat-btn">
          New Chat
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <div className="chat-list-container">
          {chats.map((chat) => (
            <div key={chat._id}>
              <button
                onClick={() => onSelectChat(chat._id)}
                className={`${
                  chat._id === selectedChatId ? "selected-chat-btn" : "chat-btn"
                }`}
              >
                {chat.title}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
