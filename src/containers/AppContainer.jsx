// import { useAuth } from '../context/AuthContext';

// function AppContainer() {
//   const { currentUser, logout } = useAuth();

//   return (
//     <div className="app-container">
//       <header className="app-header">
//         <h1>Welcome to the App</h1>
//         <div className="user-info">
//           <span>Logged in as: {currentUser.email}</span>
//           <button className="logout-btn" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="app-content">
//         <p>Your application content goes here.</p>
//         <p>You are now authenticated and have access to protected resources.</p>
//       </main>
//     </div>
//   );
// }

// export default AppContainer;

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";

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
        <h1>Chat App</h1>
        <div className="user-info">
          <span>Logged in as: {currentUser.email}</span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">
        <ChatWindow messages={messages} onSend={handleSend} />
      </main>
    </div>
  );
}

export default AppContainer;
