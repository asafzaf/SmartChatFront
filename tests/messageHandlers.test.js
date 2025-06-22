import setupMessageHandlers from "../src/handlers/socket/messageHandlers.js";

describe("setupMessageHandlers", () => {
  let socket;
  let setChatList;
  let setMessages;
  let setWaitingForResponse;

  beforeEach(() => {
    socket = { on: jest.fn() };
    setChatList = jest.fn();
    setMessages = jest.fn();
    setWaitingForResponse = jest.fn();

    // Initialize the message handlers
    setupMessageHandlers(
      socket,
      setChatList,
      setMessages,
      setWaitingForResponse
    );
  });

  // Test 1: Registers 'bot_response' handler on socket
  test("registers bot_response handler", () => {
    expect(socket.on).toHaveBeenCalledWith(
      "bot_response",
      expect.any(Function)
    );
  });

  // Test 2: Adds new bot message and removes typing if sameChat is true
  test("adds bot message if not exists and sameChat is true", () => {
    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "bot_response"
    )[1];
    const prevMessages = [
      { chatId: "chat1", text: "Hello", _id: "m1", isTyping: true },
      { chatId: "chat1", text: "real message", _id: "m2" },
    ];
    const newBotMessage = {
      chatId: "chat1",
      text: "response!",
      _id: "m3",
      isBot: true,
    };
    setMessages.mockImplementation((fn) => {
      const result = fn(prevMessages);
      expect(result).toEqual([
        { chatId: "chat1", text: "real message", _id: "m2" },
        newBotMessage,
      ]);
    });
    handler({ chatId: "chat1", botMessage: newBotMessage });
    expect(setWaitingForResponse).toHaveBeenCalledWith(false);
  });

  // Test 3: Does not add duplicate bot message if it already exists
  test("does not add duplicate bot message", () => {
    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "bot_response"
    )[1];
    const prevMessages = [
      { chatId: "chat1", text: "real message", _id: "m1" },
      { chatId: "chat1", text: "response!", _id: "m2" },
    ];
    const newBotMessage = { chatId: "chat1", text: "response!", _id: "m2" };
    setMessages.mockImplementation((fn) => {
      const result = fn(prevMessages);
      expect(result).toEqual(prevMessages); // no change expected
    });
    handler({ chatId: "chat1", botMessage: newBotMessage });
    expect(setWaitingForResponse).toHaveBeenCalledWith(false);
  });

  // Test 4: Updates chat list title and sets hasNewMessages when user is not in same chat
  test("updates chat list with title and hasNewMessages", () => {
    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "bot_response"
    )[1];
    const prevMessages = [{ chatId: "other", text: "hi", _id: "m1" }];
    const newBotMessage = { chatId: "chatX", text: "new", _id: "m2" };
    setMessages.mockImplementation((fn) => fn(prevMessages));
    const chatList = [
      { _id: "chatX", title: "Old", hasNewMessages: false },
      { _id: "chatY", title: "Other", hasNewMessages: false },
    ];
    setChatList.mockImplementation((fn) => {
      const updated = fn(chatList);
      expect(updated).toEqual([
        {
          _id: "chatX",
          title: "Updated!",
          hasNewMessages: true,
        },
        { _id: "chatY", title: "Other", hasNewMessages: false },
      ]);
    });
    handler({ chatId: "chatX", botMessage: newBotMessage, title: "Updated!" });
    expect(setWaitingForResponse).toHaveBeenCalledWith(false);
  });

  // Test 5: Updates chat title when in same chat and title is provided
  test("updates title when sameChat is true and title is provided", () => {
    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "bot_response"
    )[1];
    const prevMessages = [{ chatId: "chat1", text: "hi", _id: "m1" }];
    const newBotMessage = { chatId: "chat1", text: "updated", _id: "m2" };
    // sameChat should be true
    setMessages.mockImplementation((fn) => fn(prevMessages));
    const chatList = [
      { _id: "chat1", title: "Old title", hasNewMessages: false },
    ];
    setChatList.mockImplementation((fn) => {
      const updated = fn(chatList);
      expect(updated).toEqual([
        { _id: "chat1", title: "New title", hasNewMessages: false },
      ]);
    });
    handler({ chatId: "chat1", botMessage: newBotMessage, title: "New title" });
    expect(setWaitingForResponse).toHaveBeenCalledWith(false);
  }); // line 48

  // Test 6: Sets hasNewMessages to true when sameChat is false
  test("adds hasNewMessages=true when sameChat is false", () => {
    const handler = socket.on.mock.calls.find(
      (call) => call[0] === "bot_response"
    )[1];
    const prevMessages = [{ chatId: "chatZ", text: "hi", _id: "m1" }];
    const newBotMessage = { chatId: "chatX", text: "new msg", _id: "m2" };
    setMessages.mockImplementation((fn) => fn(prevMessages));
    const chatList = [{ _id: "chatX", title: "Keep", hasNewMessages: false }];
    setChatList.mockImplementation((fn) => {
      const updated = fn(chatList);
      expect(updated).toEqual([
        { _id: "chatX", title: "Keep", hasNewMessages: true },
      ]);
    });
    handler({ chatId: "chatX", botMessage: newBotMessage });
  }); // line 49
});
