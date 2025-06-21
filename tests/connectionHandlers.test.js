// tests/tests/connectionHandlers.test.js

import setupConnectionHandlers from "../src/handlers/socket/connectionHandlers.js";

describe("setupConnectionHandlers", () => {
    let socket;
    let userId;

    beforeEach(() => {
        socket = {
            on: jest.fn(),
            emit: jest.fn(),
            id: "mock-socket-id",
        };
        userId = "user123";

        // Initialize the connection handlers
        setupConnectionHandlers(socket, userId);
    });

    // Test 1 Registers 'connect' and 'connect_error' socket event handlers
    test("registers connect and connect_error handlers", () => {
        expect(socket.on).toHaveBeenCalledWith("connect", expect.any(Function));
        expect(socket.on).toHaveBeenCalledWith("connect_error", expect.any(Function));
    });

    // Test 2 Emits 'identify_user' when socket is connected with a valid ID
    test("connect handler emits identify_user if socket is connected", () => {
        const connectHandler = socket.on.mock.calls.find(call => call[0] === "connect")[1];
        connectHandler(); // simulate connection
        expect(socket.emit).toHaveBeenCalledWith("identify_user", userId);
    });

    // Test 3 Does not emit anything when socket.id is missing
    test("connect handler does nothing if socket.id is missing", () => {
        socket.id = null;
        const connectHandler = socket.on.mock.calls.find(call => call[0] === "connect")[1];
        connectHandler(); // simulate connection
        expect(socket.emit).not.toHaveBeenCalled();
    });

    // Test 4 Logs connection error when 'connect_error' event is triggered
    test("connect_error handler logs error", () => {
        const errorHandler = socket.on.mock.calls.find(call => call[0] === "connect_error")[1];
        console.error = jest.fn();
        const error = new Error("Connection failed");
        errorHandler(error);
        expect(console.error).toHaveBeenCalledWith("Socket.io connection error:", error);
    });
    
});
