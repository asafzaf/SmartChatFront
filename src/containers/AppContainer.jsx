import { useAuth } from "../context/AuthContext";
import { useState } from "react"; // need also useEffect
import ChatWindow from "../components/chat/ChatWindow";
// import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";
// import { getMessages, createNewMessage } from "../api/message";

function AppContainer() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  // const [selectedChatId, setSelectedChatId] = useState(null);

  // const userId = currentUser?.data?.user?._id;
  // const userEmail = currentUser?.data?.user?.email || currentUser.email;

  // useEffect(() => {
  //   if (userId && selectedChatId) {
  //     getMessages(selectedChatId, userId)
  //       .then(setMessages)
  //       .catch((err) => console.error("Error loading messages:", err));
  //   }
  // }, [userId, selectedChatId]);

  // const handleSend = async (text) => {
  //   if (!userId || !selectedChatId) return;

  //   try {
  //     const newMsg = await createNewMessage({
  //       userId,
  //       chatId: selectedChatId,
  //       sender: userEmail,
  //       text,
  //     });

  //     setMessages((prev) => [...prev, newMsg]);
  //   } catch (err) {
  //     console.error("Error sending message:", err);
  //   }
  // };

  // const handleChatSelect = (chatId) => {
  //   setSelectedChatId(chatId);
  //   setMessages([]); // Clear previous messages
  // };

  const handleSend = (text) => {
    const newMessage = {
      sender: currentUser.data.user.email,
      text,
    };
    setMessages((prev) => [...prev, newMessage]);
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
          {/* <ChatList
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChatId}
          /> */}
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
