import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";
// We'll implement local storage instead of API calls for now
// import { getMessages, createNewMessage } from "../api/message";
import { dummyMessages, dummyChats } from "../Data/dummyData";

function AppContainer() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true); // Changed from isLoading to loading to match ChatList

  const userId = currentUser?.data?.user?._id;
  const userEmail = currentUser?.data?.user?.email || currentUser.email;

  // Load chats from localStorage on initial load
  useEffect(() => {
    const loadChats = () => {
      try {
        const savedChats = localStorage.getItem("chats");
        if (savedChats) {
          setChats(JSON.parse(savedChats));
        } else {
          // Initialize with dummy data if nothing is saved
          setChats(dummyChats);
          localStorage.setItem("chats", JSON.stringify(dummyChats));
        }

        // Set the first chat as selected if none is selected
        const savedSelectedChatId = localStorage.getItem("selectedChatId");
        if (savedSelectedChatId) {
          setSelectedChatId(savedSelectedChatId);
        } else if (dummyChats.length > 0) {
          setSelectedChatId(dummyChats[0]._id);
        }
      } catch (err) {
        console.error("Error loading chats:", err);
        setChats(dummyChats);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  // Load messages when selectedChatId changes
  useEffect(() => {
    if (userId && selectedChatId) {
      try {
        // Save selected chat ID to localStorage
        localStorage.setItem("selectedChatId", selectedChatId);

        // Load messages from localStorage
        const savedMessages = localStorage.getItem(
          `messages_${selectedChatId}`
        );
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Use dummy data as fallback
          const filtered = dummyMessages.filter(
            (msg) => msg.chatId === selectedChatId && msg.userId === userId
          );
          setMessages(filtered);
          localStorage.setItem(
            `messages_${selectedChatId}`,
            JSON.stringify(filtered)
          );
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        const filtered = dummyMessages.filter(
          (msg) => msg.chatId === selectedChatId && msg.userId === userId
        );
        setMessages(filtered);
      }
    }
  }, [userId, selectedChatId]);

  const createNewMessage = async (messageData) => {
    // Simulate API call - in reality, this would call your backend
    const newMessage = {
      _id: Date.now().toString(), // Generate a pseudo-unique ID
      ...messageData,
      timestamp: new Date().toISOString(),
    };

    return newMessage;
  };

  const handleSend = async (text) => {
    if (!userId || !selectedChatId) return;

    try {
      const newMsg = await createNewMessage({
        userId,
        chatId: selectedChatId,
        sender: userEmail,
        text,
      });

      // Update messages in state
      const updatedMessages = [...messages, newMsg];
      setMessages(updatedMessages);

      // Save to localStorage
      localStorage.setItem(
        `messages_${selectedChatId}`,
        JSON.stringify(updatedMessages)
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
    setMessages([]); // Clear previous messages
  };

  const createNewChat = () => {
    const newChat = {
      _id: Date.now().toString(), // Generate a pseudo-unique ID
      title: `New Chat ${chats.length + 1}`,
      participants: [userId],
      createdAt: new Date().toISOString(),
    };

    // Update chats in state
    const updatedChats = [...chats, newChat];
    setChats(updatedChats);

    // Save to localStorage
    localStorage.setItem("chats", JSON.stringify(updatedChats));

    // Select the new chat
    setSelectedChatId(newChat._id);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <span className="header-welcom-message">
            Hello {currentUser.data.user.first_name} !
          </span>
          <img src={logo} alt="Logo" className="app-logo" />
          <div className="user-info">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="sidebar-chat-list">
          <ChatList
            chats={chats}
            loading={loading}
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChatId}
            onCreateChat={createNewChat}
          />
        </div>
        <div className="app-content">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            userData={currentUser.data.user}
          />
        </div>
      </main>
    </div>
  );
}

export default AppContainer;
