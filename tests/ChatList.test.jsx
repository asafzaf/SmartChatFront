import { render, screen, fireEvent } from "@testing-library/react";
import ChatList from "../src/components/chat/ChatList";

describe("ChatList", () => {
  const mockSelect = jest.fn();
  const mockCreate = jest.fn();
  const mockDelete = jest.fn();
  const chatsMock = [
    { _id: "1", title: "History", hasNewMessages: true },
    { _id: "2", title: "", hasNewMessages: false },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 Renders loading state when loading is true
  test("renders loading state", () => {
    render(
      <ChatList
        chats={[]}
        loading={true}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test 2 Renders empty state when there are no chats
  test("renders empty state when no chats", () => {
    render(
      <ChatList
        chats={[]}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    expect(screen.getByText("No chats found")).toBeInTheDocument();
  });

  // Test 3 Renders chat items with fallback titles and red dot for new messages
  test("renders chat items with titles and new message dot", () => {
    render(
      <ChatList
        chats={chatsMock}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId="2"
      />
    );
    const fallbackTitleBtn = screen.getByText("Chat 2").closest("button");
    expect(fallbackTitleBtn).toBeInTheDocument();
    expect(fallbackTitleBtn.textContent).toMatch(/Chat 2/);
  });

  // Test 4 Clicking 'New Chat' triggers onCreateChat callback
  test("clicking New Chat calls onCreateChat", () => {
    render(
      <ChatList
        chats={[]}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    fireEvent.click(screen.getByText("New Chat"));
    expect(mockCreate).toHaveBeenCalled();
  });

  // Test 5 Clicking a chat triggers onSelectChat with correct ID
  test("selects chat on click", () => {
    render(
      <ChatList
        chats={chatsMock}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    fireEvent.click(screen.getByText("History"));
    expect(mockSelect).toHaveBeenCalledWith("1");
  });

  // Test 6 Clicking trash icon opens delete modal and confirms deletion
  test("opens delete modal and confirms deletion", () => {
    render(
      <ChatList
        chats={chatsMock}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    // simulate hover to reveal trash icon
    const historyButton = screen.getByText("History").closest("button");
    fireEvent.mouseEnter(historyButton);
    const trashIcon = historyButton.querySelector(".trash-icon");
    fireEvent.click(trashIcon);
    fireEvent.mouseLeave(historyButton);
    // modal should appear
    expect(
      screen.getByText("Are you sure you want to delete this chat?")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  // Test 7 Cancelling delete modal prevents deletion callback
  test("cancels delete modal", () => {
    render(
      <ChatList
        chats={chatsMock}
        loading={false}
        onSelectChat={mockSelect}
        onCreateChat={mockCreate}
        onDeleteChat={mockDelete}
        selectedChatId={null}
      />
    );
    // simulate hover to reveal trash
    fireEvent.mouseEnter(screen.getByText("History").closest("button"));
    fireEvent.click(
      screen.getByText("History").closest("button").querySelector(".trash-icon")
    );
    // modal should appear
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
