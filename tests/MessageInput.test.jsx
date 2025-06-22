import { render, screen, fireEvent } from "@testing-library/react";
import MessageInput from "../src/components/chat/MessageInput";

describe("MessageInput", () => {
  // Test 1: Renders input field and Send button with correct default state
  test("renders input and button with correct initial state", () => {
    render(
      <MessageInput
        onSend={jest.fn()}
        isNewChat={false}
        waitingForResponse={false}
      />
    );
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  // Test 2: Shows 'Start Chat' button when isNewChat is true
  test("shows 'Start Chat' when isNewChat=true", () => {
    render(
      <MessageInput
        onSend={jest.fn()}
        isNewChat={true}
        waitingForResponse={false}
      />
    );
    expect(
      screen.getByRole("button", { name: /Start Chat/i })
    ).toBeInTheDocument();
  });

  // Test 3: Disables input and button when waitingForResponse is true
  test("disables input and button when waitingForResponse=true", () => {
    render(
      <MessageInput
        onSend={jest.fn()}
        isNewChat={false}
        waitingForResponse={true}
      />
    );
    expect(
      screen.getByPlaceholderText("Waiting for response...")
    ).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Test 4: Calls onSend with input text and clears the field on submit
  test("calls onSend with text and clears input on submit", () => {
    const onSendMock = jest.fn();
    const { container } = render(
      <MessageInput
        onSend={onSendMock}
        isNewChat={false}
        waitingForResponse={false}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello!" } });
    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(onSendMock).toHaveBeenCalledWith("Hello!");
    expect(input.value).toBe(""); // input should be cleared
  });

  // Test 5: Does not call onSend when input is empty or whitespace
  test("does not call onSend when input is empty or only spaces", () => {
    const onSendMock = jest.fn();
    const { container } = render(
      <MessageInput
        onSend={onSendMock}
        isNewChat={false}
        waitingForResponse={false}
      />
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(onSendMock).not.toHaveBeenCalled();
  });
});
