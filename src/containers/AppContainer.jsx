import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatList from "../components/chat/ChatList";
import logo from "../assets/logo.png";
import { io } from "socket.io-client";
// We'll implement local storage instead of API calls for now
// import { getMessages, createNewMessage } from "../api/message";
import { dummyMessages, dummyChats } from "../Data/dummyData";

import { basicConfig } from "../../etc/secrets/config.js";

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

  // // Initialize Socket.io connection
  // useEffect(() => {
  //   console.log("Initializing Socket.io connection...");
  //   // Create socket connection
  // }, [selectedChatId]); // Re-initialize when selectedChatId changes

  // Load chats from localStorage on initial load
  useEffect(() => {
    const initSocket = async () => {
      try {
        console.log("Initializing Socket.io connection...");
        console.log("User ID:", userId);
        setLoadingMessages(true);
        console.log("Loading chats...");
        socketRef.current = io(
          basicConfig.apiUrl,
          {
            transports: ["websocket"], // Use WebSocket and polling transports
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          } // Use WebSocket transport
        ); // Change to your server URL

        // Set up event listeners
        socketRef.current.on("connect", () => {
          if (!socketRef.current.id) return; // Check if socket is connected
          console.log(
            "Connected to Socket.io server with ID:",
            socketRef.current.id
          );
          socketRef.current.emit("identify_user", userId); // Send user ID to server
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("Socket.io connection error:", error);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("Disconnected from Socket.io server. Reason:", reason);
        });

        // Listen for chat list
        socketRef.current.on("chat_list", (chats) => {
          setChatList(chats);
          setLoadingChatList(false);
        });

        socketRef.current.on("chat_history", (messages) => {
          console.log("Received chat history:", messages);
          setMessages(messages);
          setLoadingMessages(false);
        });

        socketRef.current.on("chat_created", (data) => {
          console.log("New chat created:", data);
          setChatList((prevChatList) => [...prevChatList, data.chat]);
          setSelectedChatId(data.chat._id); // Automatically select the new chat
          setIsNewChat(false);

          const userMessage = {
            chatId: data.chat._id,
            sender: userId,
            message: data.chat.userPrompt,
            timestamp: new Date(),
            isBot: false,
          };

          // Add temporary waiting message
          const waitingMessage = {
            chatId: data.chat._id,
            sender: "bot",
            text: "I'm thinking...",
            timestamp: new Date(),
            isBot: true,
            isTyping: true, // Special flag for waiting message
          };

          setMessages([userMessage, waitingMessage]);
        });

        // Listen for new messages (from bot)
        socketRef.current.on("bot_response", (newMessage) => {
          console.log("Bot response received:", newMessage);

          // Remove temporary waiting message and add the actual response
          setMessages((prevMessages) => {
            // Filter out any temporary "typing" messages
            const messagesWithoutTyping = prevMessages.filter(
              (msg) => !msg.isTyping
            );
            return [...messagesWithoutTyping, newMessage];
          });

          setWaitingForResponse(false);
        });

        // Listen for confirmation of message saved
        socketRef.current.on("message_saved", (message) => {
          console.log("Message saved confirmation:", message);
        });

        if (userId) {
          socketRef.current.emit("request_chat_list", userId);
        }

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
  }, [userId]); // Only run on initial load

  // Load messages and join socket room when selectedChatId changes
  // Join chat room when selectedChatId changes
  useEffect(() => {
    if (!socketRef.current || !userId || !selectedChatId) return;

    try {
      // Join the Socket.io room for this chat
      socketRef.current.emit("join_room", selectedChatId);
      console.log(`Joined room: ${selectedChatId}`);
      setLoadingMessages(true);

      // The server will send back chat_history event
    } catch (err) {
      console.error("Error joining chat room:", err);
      setLoadingMessages(false);
    }
  }, [userId, selectedChatId]);

  // Modify your handleSend function to add the temporary message
  const handleSend = async (prompt) => {
    if (!userId || !socketRef.current) return;

    try {
      if (isNewChat) {
        // Create a new chat
        console.log("Creating new chat...");
        setLoadingMessages(true);
        let data = {
          userId: userId,
          socketId: socketRef.current.id,
          prompt: prompt,
        };
        socketRef.current.emit("create_chat", data); // Emit event to create a new chat
        // const newChat = await createNewChat(
        //   userId,
        //   socketRef.current.id,
        //   prompt
        // );
        // console.log("New chat created:", newChat);

        // Update UI with new chat
        // const chatId = newChat.data.chat._id;
        // setChatList((prevChatList) => [...prevChatList, newChat.data.chat]);

        // // Update selected chat
        // setSelectedChatId(chatId);
        // setIsNewChat(false);

        // Join the new chat room
        // socketRef.current.emit("join_room", chatId);

        // Add user message to UI immediately for better UX
        const userMessage = {
          sender: userId,
          message: prompt,
          timestamp: new Date(),
          isBot: false,
        };

        // Add temporary waiting message
        const waitingMessage = {
          sender: "bot",
          message: "",
          timestamp: new Date(),
          isBot: true,
          isTyping: true, // Special flag for waiting message
        };

        setMessages([userMessage, waitingMessage]);

        // Send message to the room
        socketRef.current.emit("send_message", {
          chatId: selectedChatId,
          message: prompt,
        });

        setWaitingForResponse(true);
      } else {
        // Send message to existing chat
        console.log("Sending message to existing chat:", selectedChatId);

        // Add user message to UI immediately
        const userMessage = {
          chatId: selectedChatId,
          sender: userId,
          message: prompt,
          timestamp: new Date(),
          isBot: false,
        };

        // Add temporary waiting message
        const waitingMessage = {
          chatId: selectedChatId,
          sender: "bot",
          message: "",
          timestamp: new Date(),
          isBot: true,
          isTyping: true, // Special flag for waiting message
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          waitingMessage,
        ]);

        // Send message to the room
        socketRef.current.emit("send_message", {
          chatId: selectedChatId,
          message: prompt,
        });

        setWaitingForResponse(true);
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
