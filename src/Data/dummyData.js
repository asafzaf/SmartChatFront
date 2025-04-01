const USER_ID = "user123";

export const dummyChats = [
  {
    _id: "chat1",
    title: "General Chat",
    participants: [USER_ID],
    createdAt: "2023-01-01T12:00:00Z",
  },
  {
    _id: "chat2",
    title: "Project Discussion",
    participants: [USER_ID],
    createdAt: "2023-01-02T10:30:00Z",
  },
  {
    _id: "chat3",
    title: "Support Chat",
    participants: [USER_ID],
    createdAt: "2023-01-03T15:45:00Z",
  },
];

// Dummy messages data
export const dummyMessages = [
  // Messages for chat1
  {
    _id: "msg1",
    chatId: "chat1",
    userId: USER_ID,
    sender: "user@example.com",
    text: "Hello! This is the first message in the General Chat.",
    timestamp: "2023-01-01T12:05:00Z",
  },
  {
    _id: "msg2",
    chatId: "chat1",
    userId: USER_ID,
    sender: "user@example.com",
    text: "How is everyone doing today?",
    timestamp: "2023-01-01T12:10:00Z",
  },

  // Messages for chat2
  {
    _id: "msg3",
    chatId: "chat2",
    userId: USER_ID,
    sender: "user@example.com",
    text: "Let's discuss the new project requirements.",
    timestamp: "2023-01-02T10:35:00Z",
  },
  {
    _id: "msg4",
    chatId: "chat2",
    userId: USER_ID,
    sender: "user@example.com",
    text: "I think we should start with the user authentication module.",
    timestamp: "2023-01-02T10:40:00Z",
  },

  // Messages for chat3
  {
    _id: "msg5",
    chatId: "chat3",
    userId: USER_ID,
    sender: "user@example.com",
    text: "I'm having an issue with the chat feature.",
    timestamp: "2023-01-03T15:50:00Z",
  },
  {
    _id: "msg6",
    chatId: "chat3",
    userId: USER_ID,
    sender: "user@example.com",
    text: "Messages aren't persisting after page reload.",
    timestamp: "2023-01-03T15:55:00Z",
  },
];
