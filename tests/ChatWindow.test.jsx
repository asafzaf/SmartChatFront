// tests/ChatWindow.test.jsx

import { render, screen } from "@testing-library/react";
import ChatWindow from "../src/components/chat/ChatWindow";

// mock components
jest.mock("../src/components/chat/MessageList", () => jest.fn(() => <div>MessageList component</div>));
jest.mock("../src/components/chat/MessageInput", () => jest.fn(() => <div>MessageInput component</div>));

describe("ChatWindow", () => {
    const mockMessages = [
        { text: "Hello", sender: "user", timestamp: Date.now() },
        { text: "Hi", sender: "bot", timestamp: Date.now() },
    ];

    const mockUser = {
        _id: "user1",
        first_name: "Noa",
    };

    const mockOnSend = jest.fn();
    const mockOnFeedback = jest.fn();

    // Test 1 Renders MessageList and MessageInput components with correct props
    test("renders MessageList and MessageInput with correct props", () => {
        render(
            <ChatWindow
                messages={mockMessages}
                onSend={mockOnSend}
                onFeedback={mockOnFeedback}
                loading={true}
                userData={mockUser}
                isNewChat={false}
                waitingForResponse={true}
            />
        );
        // check if components are rendered
        expect(screen.getByText("MessageList component")).toBeInTheDocument();
        expect(screen.getByText("MessageInput component")).toBeInTheDocument();
    });
    
});
