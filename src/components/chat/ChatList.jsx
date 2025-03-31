import { useEffect, useState } from "react";
import axios from "axios";

function ChatList({ onSelectChat, selectedChatId }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chats");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="chat-list">
      <h2 className="text-lg font-semibold mb-3">Chats</h2>

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
