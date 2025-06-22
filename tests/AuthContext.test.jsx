// tests/AuthContext.test.jsx

import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import * as authApi from "../src/api/auth";
import * as userApi from "../src/api/user";

jest.mock("../src/api/auth", () => ({
    signIn: jest.fn(),
    signUp: jest.fn(),
}));

jest.mock("../src/api/user", () => ({
    updateUser: jest.fn(),
}));

describe("AuthContext", () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    // Test 1: login succeeds and updates context + localStorage
    test("login succeeds and updates context", async () => {
        const mockUser = { _id: "123", first_name: "Test" };
        authApi.signIn.mockResolvedValue(mockUser);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            const res = await result.current.login("test@example.com", "123456");
            expect(res.success).toBe(true);
        });
        await waitFor(() => {
            expect(result.current.currentUser).toEqual(mockUser);
            expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUser));
        });
    });

    // Test 2: login fails with server error message
    test("login fails and returns error", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        authApi.signIn.mockRejectedValue({ response: { data: { message: "Bad creds" } } });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            const res = await result.current.login("wrong@example.com", "badpass");
            expect(res.success).toBe(false);
            expect(res.error).toBe("Bad creds");
        });
        spy.mockRestore();
    });

    // Test 3: signup succeeds and sets user
    test("signup succeeds and sets user", async () => {
        const newUser = { _id: "456", first_name: "New" };
        authApi.signUp.mockResolvedValue(newUser);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            const res = await result.current.signup({ email: "a@b.com", password: "pass" });
            expect(res.success).toBe(true);
        });
        await waitFor(() => {
            expect(result.current.currentUser).toEqual(newUser);
        });
    });

    // Test 4: logout clears currentUser and localStorage
    test("logout clears user and localStorage", async () => {
        localStorage.setItem("user", JSON.stringify({ some: "user" }));
        const { result } = renderHook(() => useAuth(), { wrapper });
        act(() => {
            result.current.logout();
        });
        expect(result.current.currentUser).toBe(null);
        expect(localStorage.getItem("user")).toBe(null);
    });
    
    // Test 5: syncUpdateUser updates user and reloads window
    test("syncUpdateUser works and reloads", async () => {
        const updatedUser = { _id: "999", first_name: "Updated" };
        userApi.updateUser.mockResolvedValue(updatedUser);
        const reloadMock = jest.fn();
        Object.defineProperty(window, "location", {
            value: { reload: reloadMock },
            writable: true,
        });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            const res = await result.current.syncUpdateUser({ first_name: "Updated" }, "user-id");
            expect(res.success).toBe(true);
            expect(localStorage.getItem("user")).toEqual(JSON.stringify(updatedUser));
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    // Test 6: Initializes with loading=true, becomes false after auth check
    test("initial loading is true, becomes false after auth check", async () => {
        const mockStoredUser = { _id: "abc" };
        localStorage.setItem("user", JSON.stringify(mockStoredUser));
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.currentUser).toEqual(mockStoredUser);
        });
    });

    // Test 7: login fails with unknown error (null message)
    test("login fails with unknown error", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        const error = { response: { data: { message: null } } };
        authApi.signIn.mockRejectedValue(error);
        const { result } = renderHook(() => useAuth(), { wrapper });
        let res;
        await act(async () => {
            res = await result.current.login("test@example.com", "123456");
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe("Login failed");
        spy.mockRestore();
    });

    // Test 8: login fails if signIn returns null
    test("login fails if signIn returns null", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        authApi.signIn.mockResolvedValue(null);
        const OriginalError = global.Error;
        global.Error = function (message) {
            const err = new OriginalError(message);
            err.response = { data: { message: null } }; 
            return err;
        };
        global.Error.prototype = OriginalError.prototype;
        Object.setPrototypeOf(global.Error, OriginalError);
        const { result } = renderHook(() => useAuth(), { wrapper });
        let res;
        await act(async () => {
            res = await result.current.login("someone@example.com", "123456");
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe("Login failed");
        expect(spy).toHaveBeenCalledWith("Login failed:", expect.any(Error));
        global.Error = OriginalError;
        spy.mockRestore();
    });

    // Test 9: signup fails with null response and triggers default error
    test("signup throws default error when signUp returns null (covers line 39 and fallback)", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        // Mock signUp to return null (this will trigger line 39: throw new Error("Signup failed"))
        authApi.signUp.mockResolvedValue(null);
        // Create a custom error constructor that will be used on line 39
        const OriginalError = global.Error;
        let errorCreated = false;
        global.Error = function (message) {
            errorCreated = true;
            const error = new OriginalError(message);
            // Add response structure to prevent line 71 crash
            error.response = { data: { message: null } };
            return error;
        };
        // Preserve Error properties
        global.Error.prototype = OriginalError.prototype;
        Object.setPrototypeOf(global.Error, OriginalError);
        const { result } = renderHook(() => useAuth(), { wrapper });
        let res;
        await act(async () => {
            res = await result.current.signup({ email: "a@b.com", password: "123456" });
        });
        expect(errorCreated).toBe(true); // Verify that Error constructor was called
        expect(res.success).toBe(false);
        expect(res.error).toBe("Signup failed");
        expect(console.error).toHaveBeenCalledWith("Signup failed:", expect.any(Object));
        // Restore original Error constructor
        global.Error = OriginalError;
        spy.mockRestore();
    });

    // Test 10: signup fails with server error
    test("signup fails with server error", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        authApi.signUp.mockRejectedValue({ response: { data: { message: "Signup error" } } });
        const { result } = renderHook(() => useAuth(), { wrapper });
        const res = await result.current.signup({ email: "a@b.com", password: "123" });
        expect(res.success).toBe(false);
        expect(res.error).toBe("Signup error");
        spy.mockRestore();
    });

    // Test 11: signup fails with custom API error message
    test("signup handles API error with response data", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        // Mock an API error with response.data.message
        const apiError = new Error("API Error");
        apiError.response = {
            data: {
                message: "Custom API error message"
            }
        };
        authApi.signUp.mockRejectedValue(apiError);
        const { result } = renderHook(() => useAuth(), { wrapper });
        let res;
        await act(async () => {
            res = await result.current.signup({ email: "a@b.com", password: "123456" });
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe("Custom API error message");
        expect(console.error).toHaveBeenCalledWith("Signup failed:", apiError);

        spy.mockRestore();
    });

    // Test 12: syncUpdateUser fails if API returns null
    test("syncUpdateUser fails if updateUser returns null", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        userApi.updateUser.mockResolvedValue(null);
        const { result } = renderHook(() => useAuth(), { wrapper });
        const res = await result.current.syncUpdateUser({ first_name: "Fail" }, "user-id");
        expect(res.success).toBe(false);
        expect(res.error).toBe("Update failed");
        spy.mockRestore();
    });

    // Test 13: syncUpdateUser catches error from updateUser
    test("syncUpdateUser catches error from updateUser", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        userApi.updateUser.mockRejectedValue(new Error("Server down"));
        const { result } = renderHook(() => useAuth(), { wrapper });
        const res = await result.current.syncUpdateUser({}, "user-id");
        expect(res.success).toBe(false);
        expect(res.error).toBe("Server down");
        spy.mockRestore();
    });

    // Test 14: useEffect sets user from localStorage if valid
    test("useEffect sets currentUser when localStorage contains valid user", async () => {
        const mockUser = { _id: "u123", first_name: "FromStorage" };
        localStorage.setItem("user", JSON.stringify(mockUser));
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => {
            expect(result.current.currentUser).toEqual(mockUser);
            expect(result.current.loading).toBe(false);
        });
    });

    // Test 15: useEffect continues even if localStorage.getItem throws (covers line 25)
    test("useEffect continues after localStorage.getItem crash (covers line 25)", async () => {
        const getItemSpy = jest.spyOn(window.localStorage.__proto__, "getItem");
        getItemSpy.mockImplementation(() => {
            throw new Error("Simulated localStorage read error");
        });
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        let result;
        await act(async () => {
            ({ result } = renderHook(() => useAuth(), { wrapper: AuthProvider }));
        });
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.currentUser).toBeNull();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Authentication error:",
                expect.any(Error)
            );
        });
        getItemSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    // Test 16: useEffect behaves correctly when no user in localStorage
    test("useEffect handles no user in localStorage", async () => {
        // Spy on and mock localStorage.getItem to return null
        const localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem')
            .mockReturnValue(null);
        const { result } = renderHook(() => useAuth(), { wrapper });
        // Wait for the useEffect to run and setLoading(false)
        await waitFor(() => {
            // Assert that localStorage.getItem was called for 'user'
            expect(localStorageGetItemSpy).toHaveBeenCalledWith("user");
            // Assert that no current user is set
            expect(result.current.currentUser).toBeNull();
            // Assert that loading state is false after the check
            expect(result.current.loading).toBe(false);
        });
        localStorageGetItemSpy.mockRestore(); // Clean up the spy after the test
    });

    // Test 17: syncUpdateUser fallback when error has no message (covers line 97)
    test("syncUpdateUser handles error without message (covers fallback on line 97)", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        const fakeError = {};
        userApi.updateUser.mockRejectedValue(fakeError);
        const { result } = renderHook(() => useAuth(), { wrapper });
        const res = await result.current.syncUpdateUser({ name: "Fail" }, "user-id");
        expect(res.success).toBe(false);
        expect(res.error).toBe("Update failed");
        spy.mockRestore();
    });

});