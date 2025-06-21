// tests/useSocket.test.js

import { renderHook, act } from "@testing-library/react";
import useSocket from "../src/handlers/hooks/useSocket";

jest.mock("../src/handlers/socket/socket.js", () => {
    const mockSocket = {
        emit: jest.fn(),
        disconnect: jest.fn(),
    };

    return {
        __esModule: true,
        initializeSocket: jest.fn(() => mockSocket),
        joinChatRoom: jest.fn(),
        sendMessageToExistingChat: jest.fn(),
        createNewChat: jest.fn(),
        mockSocket,
    };
});

import {
    initializeSocket,
    joinChatRoom,
    sendMessageToExistingChat,
    createNewChat,
    mockSocket,
} from "../src/handlers/socket/socket.js";

describe("useSocket", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Initializes socket on mount and disconnects on unmount
    test("initializes socket on mount and disconnects on unmount", () => {
        const { unmount } = renderHook(() => useSocket("user123"));
        expect(initializeSocket).toHaveBeenCalledWith(
            "user123",
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function),
            expect.any(Function)
        );
        unmount();
        expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    // Test 2: handleSend creates new chat if isNewChat is true
    test("handleSend creates new chat if isNewChat is true", () => {
        const { result } = renderHook(() => useSocket("user123"));
        act(() => {
            result.current.handleSend("Hi from new chat");
        });
        expect(createNewChat).toHaveBeenCalledWith(
            mockSocket,
            "user123",
            "Hi from new chat",
            expect.any(Function),
            expect.any(Function),
            expect.any(Function)
        );
    });

    // Test 3: handleSend sends message to existing chat if isNewChat is false
    test("handleSend sends message to existing chat if isNewChat is false", () => {
        const { result } = renderHook(() => useSocket("user123"));
        // simulate existing chat
        act(() => {
            result.current.setIsNewChat(false);
            result.current.setSelectedChatId("chat999");
        });
        act(() => {
            result.current.handleSend("Hi again");
        });
        expect(sendMessageToExistingChat).toHaveBeenCalledWith(
            mockSocket,
            "chat999",
            "user123",
            "Hi again",
            expect.any(Function),
            expect.any(Function)
        );
    });

    // Test 4: handleChatSelect sets existing chat and loading state
    test("handleChatSelect sets existing chat and loading", () => {
        const { result } = renderHook(() => useSocket("user123"));
        act(() => {
            result.current.handleChatSelect("chat123");
        });
        expect(result.current.isNewChat).toBe(false);
        expect(result.current.selectedChatId).toBe("chat123");
        expect(result.current.messages).toEqual([]);
        expect(result.current.loadingMessages).toBe(true);
    });

    // Test 5: Cleans up and disconnects socket (or not) on unmount
    test("cleanup disconnects when socket exists, skips when not", () => {
        // 1. userId is valid, socketRef.current exists
        const { unmount } = renderHook(() => useSocket("user123"));
        expect(mockSocket.disconnect).not.toHaveBeenCalled();
        unmount();
        expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
        // 2. simulate socketRef.current being null
        initializeSocket.mockReturnValueOnce(null); // force null socket
        const { unmount: unmountNull } = renderHook(() => useSocket("user123"));
        unmountNull();
        // disconnect should NOT be called again
        expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    }); // cover line 42

    // Test 6: handleSend catches error from createNewChat
    test("handleSend catches error in createNewChat", () => {
        const originalError = console.error;
        console.error = jest.fn(); // simulate error and silence it
        createNewChat.mockImplementation(() => {
            throw new Error("failed to send");
        });
        const { result } = renderHook(() => useSocket("user123"));
        act(() => {
            result.current.handleSend("Trigger error");
        });
        expect(createNewChat).toHaveBeenCalled();
        console.error = originalError;
    });

    // Test 7: handleSend exits early if userId or socket is missing
    test("handleSend does nothing if userId or socketRef is missing", () => {
        const { result } = renderHook(() => useSocket(null)); // userId=null
        act(() => {
            result.current.handleSend("hello!");
        });
        expect(createNewChat).not.toHaveBeenCalled();
        expect(sendMessageToExistingChat).not.toHaveBeenCalled();
    }); // cover line 60

    // Test 8: handleChatSelect exits early if chatId equals selectedChatId
    test("handleChatSelect exits early if chatId equals selectedChatId", () => {
        const { result } = renderHook(() => useSocket("user123"));
        act(() => {
            result.current.setSelectedChatId("chatABC");
        });
        act(() => {
            result.current.handleChatSelect("chatABC");
        });

        expect(result.current.selectedChatId).toBe("chatABC");
        // line 99 cover
    });

    // Test 9: handleChatSelect exits early if userId is missing
    test("handleChatSelect exits early if userId is missing", () => {
        const { result } = renderHook(() => useSocket(null));
        act(() => {
            result.current.handleChatSelect("chatXYZ");
        });
        expect(joinChatRoom).not.toHaveBeenCalled();
        // cover line 100
    });

    // Test 10: setNewChatMode resets chat-related state
    test("setNewChatMode resets chat state", () => {
        const { result } = renderHook(() => useSocket("user123"));
        act(() => {
            result.current.setNewChatMode();
        });
        expect(result.current.isNewChat).toBe(true);
        expect(result.current.selectedChatId).toBe(null);
        expect(result.current.messages).toEqual([]);
        expect(result.current.waitingForResponse).toBe(false);
    }); // cover line 112-113

});

