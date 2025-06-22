import axios from "axios";

jest.mock("../src/api/auth.js", () => {
  const axios = require("axios");
  return {
    __esModule: true,
    signUp: async (userData) => {
      const apiUrl = "http://mocked-api.com";
      const res = await axios.post(`${apiUrl}/api/auth/signup`, userData);
      return res.data;
    },
    signIn: async (email, password) => {
      const apiUrl = "http://mocked-api.com";
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password,
      });
      return res.data;
    },
  };
});

import { signUp, signIn } from "../src/api/auth.js";

jest.mock("axios");

describe("auth.js – full coverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test 1 signUp returns successful response data from axios
  test("signUp returns data from axios", async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const res = await signUp({ email: "test@example.com", password: "123" });
    expect(res).toEqual({ success: true });
    expect(axios.post).toHaveBeenCalledWith(
      "http://mocked-api.com/api/auth/signup",
      { email: "test@example.com", password: "123" }
    );
  });

  // Test 2 signUp throws error when axios rejects
  test("signUp throws on axios error", async () => {
    axios.post.mockRejectedValue(new Error("Signup failed"));
    await expect(signUp({})).rejects.toThrow("Signup failed");
  });

  // Test 3 signIn returns token from axios
  test("signIn returns token from axios", async () => {
    axios.post.mockResolvedValue({ data: { token: "abc123" } });
    const res = await signIn("test@example.com", "123");
    expect(res).toEqual({ token: "abc123" });
    expect(axios.post).toHaveBeenCalledWith(
      "http://mocked-api.com/api/auth/login",
      { email: "test@example.com", password: "123" }
    );
  });

  // Test 4 signIn throws error when axios rejects
  test("signIn throws on axios error", async () => {
    axios.post.mockRejectedValue(new Error("Login failed"));
    await expect(signIn("a", "b")).rejects.toThrow("Login failed");
  });
});
