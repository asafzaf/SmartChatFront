import { render, screen, fireEvent } from "@testing-library/react";
import MessageComponent from "../src/components/chat/MessageComponent";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("remark-gfm", () => ({}));

describe("MessageComponent", () => {
  const currentUser = { _id: "user1" };
  const handleOpenForm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders sent message if sender is the current user (no feedback option)
  test("renders sent message if sender is current user", () => {
    const message = {
      _id: "msg1",
      text: "Hello from me",
      sender: "user1",
      gotFeedback: false,
    };
    render(
      <MessageComponent
        message={message}
        currentUser={currentUser}
        handleOpenForm={handleOpenForm}
        index={0}
      />
    );
    expect(screen.getByText("Hello from me")).toBeInTheDocument();
    expect(
      screen.queryByText("Want to Share Feedback?")
    ).not.toBeInTheDocument();
  });

  // Test 2: Renders received markdown message from bot
  test("renders received markdown message from bot", () => {
    const message = {
      _id: "msg2",
      text: "**Hello** _from bot_",
      sender: "bot",
      gotFeedback: false,
    };
    render(
      <MessageComponent
        message={message}
        currentUser={currentUser}
        handleOpenForm={handleOpenForm}
        index={0}
      />
    );
    expect(screen.getByText("**Hello** _from bot_")).toBeInTheDocument();
  });

  // Test 3: Shows feedback button on odd index if feedback not yet given
  test("shows feedback button on odd index without feedback", () => {
    const message = {
      _id: "msg3",
      text: "Give me feedback please",
      sender: "bot",
      gotFeedback: false,
    };
    render(
      <MessageComponent
        message={message}
        currentUser={currentUser}
        handleOpenForm={handleOpenForm}
        index={1}
      />
    );
    const btn = screen.getByText("Want to Share Feedback?");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleOpenForm).toHaveBeenCalledWith(message);
  });

  // Test 4: Does not show feedback button if gotFeedback is true
  test("does not show feedback button if gotFeedback=true", () => {
    const message = {
      _id: "msg4",
      text: "No feedback needed",
      sender: "bot",
      gotFeedback: true,
    };
    render(
      <MessageComponent
        message={message}
        currentUser={currentUser}
        handleOpenForm={handleOpenForm}
        index={1}
      />
    );
    expect(
      screen.queryByText("Want to Share Feedback?")
    ).not.toBeInTheDocument();
  });
});
