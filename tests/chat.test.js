import axios from "axios";
import * as config from "../src/api/api.conf.js";

jest.mock("axios");

jest.spyOn(config, "getUserId").mockReturnValue("user999");
jest.spyOn(config, "createHeaders").mockReturnValue({
  Authorization: "Bearer test-token",
});

const apiUrl = "https://mocked-api.com";

const getChatList = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch chat list");
  }
  const headers = config.createHeaders();
  const response = await axios.get(`${apiUrl}/api/chat/${userId}/list`, {
    data: { userId },
    headers,
  });
  return response.data;
};

const deleteChat = async (chatId) => {
  if (!chatId) {
    return { error: new Error("Chat ID is required to delete a chat") };
  }
  const userId = config.getUserId();
  const headers = config.createHeaders();
  try {
    const response = await axios.delete(`${apiUrl}/api/chat/${chatId}`, {
      data: { userId },
      headers,
    });
    return response.data;
  } catch (error) {
    return { error };
  }
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("chat.js – API Functions (mocked)", () => {
  // Test 1 Verifies getChatList sends correct axios GET request
  test("getChatList calls axios.get with correct URL and headers", async () => {
    axios.get.mockResolvedValue({ data: ["chat1", "chat2"] });
    const result = await getChatList("user999");
    expect(axios.get).toHaveBeenCalledWith(
      "https://mocked-api.com/api/chat/user999/list",
      {
        data: { userId: "user999" },
        headers: { Authorization: "Bearer test-token" },
      }
    );
    expect(result).toEqual(["chat1", "chat2"]);
  });

  // Test 2 Throws error when getChatList is called without userId
  test("getChatList throws error when no userId", async () => {
    await expect(getChatList(null)).rejects.toThrow(
      "User ID is required to fetch chat list"
    );
  });
  // Test 3 Verifies deleteChat sends correct axios DELETE request
  test("deleteChat calls axios.delete with correct URL and headers", async () => {
    axios.delete.mockResolvedValue({ data: { success: true } });
    const result = await deleteChat("chat42");
    expect(axios.delete).toHaveBeenCalledWith(
      "https://mocked-api.com/api/chat/chat42",
      {
        data: { userId: "user999" },
        headers: { Authorization: "Bearer test-token" },
      }
    );
    expect(result).toEqual({ success: true });
  });

  // Test 4 Returns error object if axios DELETE request fails
  test("deleteChat returns error object when failed", async () => {
    axios.delete.mockRejectedValue(new Error("Server error"));
    const result = await deleteChat("chat42");
    expect(result).toHaveProperty("error");
    expect(result.error.message).toBe("Server error");
  });

  // Test 5 Returns error if deleteChat is called without chatId
  test("deleteChat returns error if no chatId", async () => {
    const result = await deleteChat(null);
    expect(result).toEqual({
      error: expect.any(Error),
    });
  });
});
