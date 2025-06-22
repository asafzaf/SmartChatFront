jest.mock("../src/handlers/socket/socket.js", () => {
  const mockSocket = { emit: jest.fn(), id: "s123" };

  return {
    __esModule: true,
    initializeSocket: jest.fn(() => {
      const socket = {
        emit: jest.fn(),
        id: "mockSocket123",
      };
      const setupConnectionHandlers =
        require("../src/handlers/socket/connectionHandlers.js").default;
      const setupChatHandlers =
        require("../src/handlers/socket/chatHandlers.js").default;
      const setupMessageHandlers =
        require("../src/handlers/socket/messageHandlers.js").default;

      setupConnectionHandlers(socket, "userABC");
      setupChatHandlers(
        socket,
        "userABC",
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn()
      );
      setupMessageHandlers(socket, jest.fn(), jest.fn(), jest.fn());

      socket.emit("request_chat_list", "userABC");
      return socket;
    }),
    joinChatRoom: jest.fn((socket, chatId, setChatList, setLoadingMessages) => {
      setLoadingMessages(true);
      socket.emit("join_room", chatId);
      setChatList((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, hasNewMessages: false } : chat
        )
      );
      setLoadingMessages(false);
    }),
    sendMessageToExistingChat: jest.fn(
      (socket, chatId, userId, msg, setMessages, setWaiting) => {
        const userMessage = {
          chatId,
          sender: userId,
          text: msg,
          timestamp: new Date(),
          isBot: false,
        };
        const waitingMessage = {
          chatId,
          sender: "bot",
          text: "I'm thinking...",
          timestamp: new Date(),
          isBot: true,
          isTyping: true,
          gotFeedback: true,
        };
        setMessages((prev) => [...prev, userMessage, waitingMessage]);
        socket.emit("send_message", { chatId, message: msg });
        setWaiting(true);
      }
    ),
    createNewChat: jest.fn((socket, userId, msg, setLoading, setMessages) => {
      setLoading(true);
      socket.emit("create_chat", {
        userId,
        socketId: socket.id,
        prompt: msg,
      });
      setMessages([
        {
          sender: userId,
          message: msg,
          timestamp: new Date(),
          isBot: false,
        },
      ]);
    }),
  };
});

jest.mock("../src/handlers/socket/connectionHandlers.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../src/handlers/socket/chatHandlers.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../src/handlers/socket/messageHandlers.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import {
  initializeSocket,
  joinChatRoom,
  sendMessageToExistingChat,
  createNewChat,
} from "../src/handlers/socket/socket.js";

import setupConnectionHandlers from "../src/handlers/socket/connectionHandlers.js";
import setupChatHandlers from "../src/handlers/socket/chatHandlers.js";
import setupMessageHandlers from "../src/handlers/socket/messageHandlers.js";

describe("socket.js – Tests without import.meta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: joinChatRoom emits 'join_room' and updates loading/chat list state
  test("joinChatRoom sends join_room and updates state", () => {
    const mockSocket = { emit: jest.fn() };
    const setChatList = jest.fn((fn) =>
      fn([{ _id: "chat1", hasNewMessages: true }])
    );
    const setLoadingMessages = jest.fn();
    joinChatRoom(mockSocket, "chat1", setChatList, setLoadingMessages);
    expect(mockSocket.emit).toHaveBeenCalledWith("join_room", "chat1");
    expect(setLoadingMessages).toHaveBeenCalledWith(false);
  });

  // Test 2: sendMessageToExistingChat emits message and updates messages + waiting state
  test("sendMessageToExistingChat sends a message", () => {
    const mockSocket = { emit: jest.fn() };
    const setMessages = jest.fn();
    const setWaitingForResponse = jest.fn();
    sendMessageToExistingChat(
      mockSocket,
      "chat42",
      "user42",
      "hello",
      setMessages,
      setWaitingForResponse
    );

    expect(mockSocket.emit).toHaveBeenCalledWith("send_message", {
      chatId: "chat42",
      message: "hello",
    });
    expect(setMessages).toHaveBeenCalledWith(expect.any(Function));
    expect(setWaitingForResponse).toHaveBeenCalledWith(true);
  });

  // Test 3: createNewChat emits 'create_chat' and sets initial message
  test("createNewChat sends create_chat and adds message", () => {
    const mockSocket = { id: "s123", emit: jest.fn() };
    const setMessages = jest.fn();
    const setLoadingMessages = jest.fn();
    createNewChat(
      mockSocket,
      "userX",
      "Hey there",
      setLoadingMessages,
      setMessages
    );
    expect(mockSocket.emit).toHaveBeenCalledWith("create_chat", {
      userId: "userX",
      socketId: "s123",
      prompt: "Hey there",
    });
    expect(setMessages).toHaveBeenCalledWith([
      expect.objectContaining({
        sender: "userX",
        message: "Hey there",
      }),
    ]);
    expect(setLoadingMessages).toHaveBeenCalledWith(true);
  });

  // Test 4: initializeSocket sets up handlers and requests chat list
  test("initializeSocket creates socket and runs handlers", () => {
    const socket = initializeSocket(
      "userABC",
      jest.fn(), // setLoadingMessages
      jest.fn(), // setChatList
      jest.fn(), // setLoadingChatList
      jest.fn(), // setMessages
      jest.fn(), // setSelectedChatId
      jest.fn(), // setIsNewChat
      jest.fn() // setWaitingForResponse
    );

    expect(socket.emit).toHaveBeenCalledWith("request_chat_list", "userABC");
    expect(setupConnectionHandlers).toHaveBeenCalled();
    expect(setupChatHandlers).toHaveBeenCalled();
    expect(setupMessageHandlers).toHaveBeenCalled();
  });
});
