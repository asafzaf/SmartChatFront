import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";
import { getChatList, deleteChat } from "../api/chat";
import {
  initializeSocket,
  joinChatRoom,
  sendMessageToExistingChat,
  createNewChat,
} from "../handlers/socket/socket";
import { sendFeedback } from "../api/feedback.js";

function AppContainer() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [loadingChatList, setLoadingChatList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true); // Flag to indicate if it's a new chat
  // const [error, setError] = useState(null);

  const socketRef = useRef(null);

  const userId = currentUser?.data?.user?._id;

  // Initialize Socket.io connection and load chats on initial load
  useEffect(() => {
    const initSocket = async () => {
      try {
        setLoadingMessages(true);

        // Initialize Socket.io with all the state setters it needs
        socketRef.current = initializeSocket(
          userId,
          setLoadingMessages,
          setChatList,
          setLoadingChatList,
          setMessages,
          setSelectedChatId,
          setIsNewChat,
          setWaitingForResponse
        );

        // Clean up on unmount
        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (err) {
        console.error("Error initializing socket:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    const initChats = async () => {
      console.log("Loading chat list...");
      setLoadingChatList(true);

      try {
        const chatlist = await getChatList(userId);
        console.log("Chat list received:", chatlist);

        if (chatlist.error) {
          console.error("Error fetching chat list:", chatlist.error);
        } else {
          console.log("Chat list:", chatlist.data.chatList);
          setTimeout(() => {
            setChatList(chatlist.data.chatList);
            setLoadingChatList(false);
          }, 2000); // Delay to allow chat list to update
        }
      } catch (err) {
        console.error("Error fetching chat list:", err);
        setLoadingChatList(false);
      }
    };

    initSocket();
    initChats();
  }, [userId]); // Only run on initial load

  // Join chat room when selectedChatId changes
  useEffect(() => {
    if (!socketRef.current || !userId || !selectedChatId) return;

    joinChatRoom(
      socketRef.current,
      selectedChatId,
      setChatList,
      setLoadingMessages
    );
  }, [userId, selectedChatId]);

  const handleSend = async (prompt) => {
    if (!userId || !socketRef.current) return;

    try {
      if (isNewChat) {
        // Create a new chat using the socket handler
        createNewChat(
          socketRef.current,
          userId,
          prompt,
          setLoadingMessages,
          setMessages,
          setWaitingForResponse
        );
      } else {
        // Send message to existing chat using the socket handler
        sendMessageToExistingChat(
          socketRef.current,
          selectedChatId,
          userId,
          prompt,
          setMessages,
          setWaitingForResponse
        );
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleChatSelect = (chatId) => {
    if (!chatId) {
      setIsNewChat(true);
      setMessages([]);
      setSelectedChatId(null);
      return;
    }

    if (chatId === selectedChatId) return; // Prevent re-selecting the same chat
    if (!userId) return;

    // No need to explicitly leave rooms - the server handles this
    setIsNewChat(false);
    setSelectedChatId(chatId);
    setMessages([]); // Clear messages while loading new ones
    setLoadingMessages(true);
  };

  const setNewChatMode = () => {
    handleChatSelect(null); // Set new chat mode
    setWaitingForResponse(false); // Reset waiting state
  };

  const handleDeleteChat = async (chatIdToDelete) => {
    if (!chatIdToDelete) return;

    try {
      const res = await deleteChat(chatIdToDelete);
      if (res.error) {
        console.error("Failed to delete chat:", res.error);
        return;
      }

      setChatList((prevList) =>
        prevList.filter((chat) => chat._id !== chatIdToDelete)
      );

      if (selectedChatId === chatIdToDelete) {
        setMessages([]);
        setSelectedChatId(null);
        setIsNewChat(true);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  const handleFeedback = async (feedback) => {
    if (!userId || !selectedChatId) return;

    try {
      const res = await sendFeedback(userId, selectedChatId, feedback);
      if (res.error) {
        console.error("Failed to send feedback:", res.error);
        return;
      }
      console.log("Feedback sent successfully:", res);
    } catch (err) {
      console.error("Error sending feedback:", err);
    }
  }

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
            chats={chatList}
            loading={loadingChatList}
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChatId}
            onCreateChat={setNewChatMode}
            onDeleteChat={handleDeleteChat}
          />
        </div>
        <div className="app-content">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            onFeedback={handleFeedback}
            loading={loadingMessages}
            userData={currentUser.data.user}
            waitingForResponse={waitingForResponse}
            isNewChat={isNewChat}
          />
        </div>
      </main>
    </div>
  );
}

export default AppContainer;
