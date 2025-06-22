import setupChatHandlers from "../src/handlers/socket/chatHandlers.js";

describe("setupChatHandlers", () => {
  let socket;
  let userId;
  let setChatList;
  let setLoadingChatList;
  let setSelectedChatId;
  let setIsNewChat;
  let setMessages;

  beforeEach(() => {
    // mock all functions
    socket = {
      on: jest.fn(),
    };
    userId = "user123";
    setChatList = jest.fn();
    setLoadingChatList = jest.fn();
    setSelectedChatId = jest.fn();
    setIsNewChat = jest.fn();
    setMessages = jest.fn();
    // initialize the chat handlers
    setupChatHandlers(
      socket,
      userId,
      setChatList,
      setLoadingChatList,
      setSelectedChatId,
      setIsNewChat,
      setMessages
    );
  });

  // Test 1 Registers 'chat_list' handler and updates chat list state
  test("should register chat_list handler", () => {
    // ensure event chat_list is registered
    expect(socket.on).toHaveBeenCalledWith("chat_list", expect.any(Function));
    const callback = socket.on.mock.calls.find(
      (call) => call[0] === "chat_list"
    )[1];
    callback(["chat1", "chat2"]);
    expect(setChatList).toHaveBeenCalledWith(["chat1", "chat2"]);
    expect(setLoadingChatList).toHaveBeenCalledWith(false);
  });

  // Test 2 Handles 'chat_history' with one message – appends typing message
  test("should handle chat_history with one message (adds thinking message)", () => {
    // simulate receiving one message (should append bot typing message)
    const callback = socket.on.mock.calls.find(
      (call) => call[0] === "chat_history"
    )[1];
    const messages = [{ chatId: "c1", sender: "user123", text: "hello" }];
    callback(messages);
    expect(setMessages).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ isTyping: true, sender: "bot" }),
      ])
    );
  });

  // Test 3 Handles 'chat_created' event and updates all related state
  test("should handle chat_created and update state", () => {
    // simulate 'chat_created' event with a new chat
    const callback = socket.on.mock.calls.find(
      (call) => call[0] === "chat_created"
    )[1];
    const newChat = {
      _id: "chat42",
      userPrompt: "What is AI?",
    };
    // mock previous chat list
    const prevChats = [{ _id: "chat1" }];
    setChatList.mockImplementation((fn) => fn(prevChats));
    // ensure the new chat is added
    callback({ chat: newChat });
    expect(setChatList).toHaveBeenCalledWith(expect.any(Function));
    expect(setSelectedChatId).toHaveBeenCalledWith("chat42");
    expect(setIsNewChat).toHaveBeenCalledWith(false);
    expect(setMessages).toHaveBeenCalledWith([
      expect.objectContaining({ sender: "user123", message: "What is AI?" }),
      expect.objectContaining({ sender: "bot", isTyping: true }),
    ]);
  });

  // Test 4 Handles 'chat_history' with multiple messages – no typing message added
  test("should handle chat_history with multiple messages (no typing message added)", () => {
    const callback = socket.on.mock.calls.find(
      (call) => call[0] === "chat_history"
    )[1];
    const messages = [
      { chatId: "c1", sender: "user123", text: "hello" },
      { chatId: "c1", sender: "bot", text: "hi!" },
    ];
    callback(messages);
    expect(setMessages).toHaveBeenCalledWith(messages);
  });
});
