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
        <button
          onClick={onCreateChat}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
        >
          New Chat
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat._id}>
              <button
                onClick={() => onSelectChat(chat._id)}
                className={`w-full text-left px-3 py-2 rounded ${
                  chat._id === selectedChatId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChatList;
