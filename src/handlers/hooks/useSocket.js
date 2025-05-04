import { useState, useEffect, useRef } from 'react';
import { 
  initializeSocket, 
  joinChatRoom, 
  sendMessageToExistingChat, 
  createNewChat 
} from '../socket/socket';

/**
 * Custom hook for managing Socket.io functionality
 * @param {string} userId - Current user ID
 * @returns {Object} Socket-related state and handlers
 */
const useSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loadingChatList, setLoadingChatList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [isNewChat, setIsNewChat] = useState(true);
  
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

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

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Join chat room when selectedChatId changes
  useEffect(() => {
    if (!socketRef.current || !userId || !selectedChatId) return;
    
    joinChatRoom(socketRef.current, selectedChatId, setLoadingMessages);
  }, [userId, selectedChatId]);

  /**
   * Send a message (create new chat or add to existing chat)
   * @param {string} prompt - Message text
   */
  const handleSend = async (prompt) => {
    if (!userId || !socketRef.current) return;

    try {
      if (isNewChat) {
        createNewChat(
          socketRef.current,
          userId,
          prompt,
          setLoadingMessages,
          setMessages,
          setWaitingForResponse
        );
      } else {
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

  /**
   * Select a chat or set new chat mode
   * @param {string|null} chatId - Chat ID to select or null for new chat
   */
  const handleChatSelect = (chatId) => {
    if (!chatId) {
      setIsNewChat(true);
      setMessages([]);
      setSelectedChatId(null);
      return;
    }

    if (chatId === selectedChatId) return;
    if (!userId) return;

    setIsNewChat(false);
    setSelectedChatId(chatId);
    setMessages([]);
    setLoadingMessages(true);
  };

  /**
   * Set new chat mode
   */
  const setNewChatMode = () => {
    handleChatSelect(null);
    setWaitingForResponse(false);
  };

  return {
    // State
    messages,
    chatList,
    selectedChatId,
    loadingChatList,
    loadingMessages,
    waitingForResponse,
    isNewChat,
    
    // Methods
    handleSend,
    handleChatSelect,
    setNewChatMode,
    
    // Setters (in case parent components need direct access)
    setMessages,
    setChatList,
    setSelectedChatId,
    setLoadingMessages,
    setLoadingChatList,
    setWaitingForResponse,
    setIsNewChat
  };
};

export default useSocket;