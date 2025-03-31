import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
// import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";

function AppContainer() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);

  const handleSend = (text) => {
    const newMessage = {
      sender: currentUser.email,
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
          {/* <h1 className="app-title">SmartChat</h1> */}
          <div className="user-info">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="sidebar-chat-list">{/* <ChatList /> */}</div>
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
