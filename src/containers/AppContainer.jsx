import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";
import { io } from "socket.io-client";
// We'll implement local storage instead of API calls for now
// import { getMessages, createNewMessage } from "../api/message";
import { dummyMessages, dummyChats } from "../Data/dummyData";

import { localConfig } from "../api/config";

import { createNewChat, getChatList } from "../api/chat"; // Uncomment when API is ready

function AppContainer() {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingChatList, setLoadingChatList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true); // Flag to indicate if it's a new chat
  const [error, setError] = useState(null);

  // Socket.io reference
  const socketRef = useRef(null);

  const userId = currentUser?.data?.user?._id;

  // Initialize Socket.io connection
  useEffect(() => {
    console.log("Initializing Socket.io connection...");
    // Create socket connection
  }, [selectedChatId]); // Re-initialize when selectedChatId changes

  // Load chats from localStorage on initial load
  useEffect(() => {
    const initSocket = () => {
      try {
        setLoadingMessages(true);
        console.log("Loading chats...");
        socketRef.current = io(
          localConfig.apiUrl,
          {
            transports: ["websocket"], // Use WebSocket and polling transports
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          } // Use WebSocket transport
        ); // Change to your server URL

        // Set up event listeners
        socketRef.current.on("connect", () => {
          console.log(
            "Connected to Socket.io server with ID:",
            socketRef.current.id
          );
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("Socket.io connection error:", error);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("Disconnected from Socket.io server. Reason:", reason);
        });

        // socketRef.current.on("chat_list", (chatList) => {
        //   console.log("Received chat list:", chatList);
        //   // Update chatList state with the received chat list
        //   // setChatList(chatList);
        //   // Save chat list to localStorage
        // });

        socketRef.current.on("chat_history", (chatHistory) => {
          console.log("Received chat history:", chatHistory);
          // Update messages state with chat history
          setMessages(chatHistory);
        });

        // Listen for new messages
        socketRef.current.on("message_recieved", (newMessage) => {
          console.log("New message received:", newMessage);
          // Update messages state with the new message
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socketRef.current.emit("request_chat_list", userId);

        // Clean up on unmount
        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (err) {
        console.error("Error loading chats:", err);
        setChatList([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    const init_chats = async () => {
      console.log("Loading chat list...");
      setLoadingChatList(true);
      const chatlist = await getChatList(userId);
      console.log("Chat list received:", chatlist);
      if (chatlist.error) {
        console.error("Error fetching chat list:", chatlist.error);
      }

      console.log("Chat list:", chatlist.data.chatList);
      setTimeout(() => {
        setChatList(chatlist.data.chatList);
        setLoadingChatList(false);
      }, 2000); // Delay to allow chat list to update
    };

    initSocket();
    init_chats();
  }, []);

  // Load messages and join socket room when selectedChatId changes
  useEffect(() => {
    if (userId && selectedChatId) {
      try {
        // Join the Socket.io room for this chat
        socketRef.current.emit("join_room", selectedChatId);
        console.log(`Joined room: ${selectedChatId}`);
      } catch (err) {
        console.error("Error loading messages:", err);
        const filtered = dummyMessages.filter(
          (msg) => msg.chatId === selectedChatId && msg.userId === userId
        );
        setMessages(filtered);
      }
    }
  }, [userId, selectedChatId]);

  const handleSend = async (prompt) => {
    console.log("Sending message:", prompt);
    console.log("Selected chat ID:", selectedChatId);
    console.log("User ID:", userId);
    console.log("Is new chat:", isNewChat);
    if (!userId) return;
    try {
      if (isNewChat) {
        // Create a new chat if needed
        console.log("Creating new chat...");
        const newChat = await createNewChat(
          userId,
          socketRef.current.id,
          prompt
        );
        console.log("New chat created:", newChat);
        // socketRef.current.emit("request_chat_list", userId);
        // const chatList = await getChatList(userId);
        // console.log("Chat list received:", chatList);
        // setTimeout(() => {
        // console.log("Chat list:", chatList.data.chatlist);

        setChatList((prevChatList) => [...prevChatList, newChat.data.chat]); // Update chat list with the new chat
        handleChatSelect(newChat.data.chat._id);
        setWaitingForResponse(true);
        setIsNewChat(false);
        // }, 2000); // Delay to allow chat list to update
      } else {
        console.log("Sending message:", prompt);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleChatSelect = (chatId) => {
    if (!chatId) {
      setIsNewChat(true); // Set new chat mode if no chat ID is provided
      setMessages([]); // Clear messages
      return;
    }
    console.log("Selected chat ID:", chatId);
    console.log("User ID:", userId);
    console.log("Is new chat:", isNewChat);
    if (chatId === selectedChatId) return; // Prevent re-selecting the same chat
    if (!userId) return;

    // Leave current room if any
    if (selectedChatId && socketRef.current) {
      console.log("Leaving room:", selectedChatId);
      socketRef.current.emit("leave_room", selectedChatId);
    }

    setIsNewChat(false); // Reset new chat mode
    setSelectedChatId(chatId);
    // setMessages([]); // Clear previous messages
  };

  const setNewChatMode = () => {
    handleChatSelect(null); // Set new chat mode
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
            chats={chatList}
            loading={loadingChatList}
            onSelectChat={handleChatSelect}
            selectedChatId={selectedChatId}
            onCreateChat={setNewChatMode}
          />
        </div>
        <div className="app-content">
          <ChatWindow
            messages={messages}
            onSend={handleSend}
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
