// tests/api.conf.test.js

import { createHeaders, getUserId } from "../src/api/api.conf.js";

describe("api.conf.js", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // test 1 Checks that createHeaders returns headers with token when user exists in localStorage
  test("createHeaders returns headers with token if user exists", () => {
    const mockUser = {
      data: {
        token: "abc123",
        user: { _id: "user42" },
      },
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    const headers = createHeaders();
    expect(headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer abc123",
    });
  });

  // test 2 Checks that createHeaders returns basic headers if no user in localStorage
  test("createHeaders returns basic headers if no user in localStorage", () => {
    const headers = createHeaders();
    expect(headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  // test 3 Checks that getUserId returns user ID if exists in localStorage
  test("getUserId returns user ID if exists", () => {
    const mockUser = {
      data: {
        token: "abc123",
        user: { _id: "user999" },
      },
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    const userId = getUserId();
    expect(userId).toBe("user999");
  });

  // test 4 Checks that getUserId returns null if no user in localStorage
  test("getUserId returns null if user not found", () => {
    const userId = getUserId();
    expect(userId).toBeNull();
  });

});
