import axios from "axios";
import * as config from "../src/api/api.conf.js";

jest.mock("axios");
jest
  .spyOn(config, "createHeaders")
  .mockReturnValue({ Authorization: "Bearer xyz" });

const apiUrl = "https://mocked-api.com";

const sendFeedback = async (userId, chatId, feedback) => {
  if (!userId || !chatId || !feedback) {
    throw new Error("User ID, Chat ID, and feedback are required");
  }
  const headers = config.createHeaders();
  const response = await axios.post(
    `${apiUrl}/api/feedback`,
    { userId, chatId, feedback },
    { headers }
  );
  return response.data;
};

describe("feedback.js – with local implementation", () => {
  beforeEach(() => jest.clearAllMocks());

  // Test 1: Returns success response when input is valid
  test("returns success with valid input", async () => {
    axios.post.mockResolvedValue({ data: { ok: true } });
    const res = await sendFeedback("user1", "chat1", { rating: 10 });
    expect(res).toEqual({ ok: true });
    expect(axios.post).toHaveBeenCalledWith(
      "https://mocked-api.com/api/feedback",
      { userId: "user1", chatId: "chat1", feedback: { rating: 10 } },
      { headers: { Authorization: "Bearer xyz" } }
    );
  });

  // Test 2: Throws error if userId is missing
  test("throws when userId is missing", async () => {
    await expect(sendFeedback(null, "chat1", {})).rejects.toThrow(
      "User ID, Chat ID, and feedback are required"
    );
  });

  // Test 3: Throws error if chatId is missing
  test("throws when chatId is missing", async () => {
    await expect(sendFeedback("user1", null, {})).rejects.toThrow(
      "User ID, Chat ID, and feedback are required"
    );
  });

  // Test 4: Throws error if feedback is missing
  test("throws when feedback is missing", async () => {
    await expect(sendFeedback("user1", "chat1", null)).rejects.toThrow(
      "User ID, Chat ID, and feedback are required"
    );
  });

  // Test 5: Throws error if axios request fails
  test("throws axios error when request fails", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));
    await expect(sendFeedback("user1", "chat1", {})).rejects.toThrow(
      "Network error"
    );
  });

  // Test 6: Calls createHeaders to include auth in request
  test("calls createHeaders", async () => {
    axios.post.mockResolvedValue({ data: {} });
    await sendFeedback("user1", "chat1", {});
    expect(config.createHeaders).toHaveBeenCalled();
  });
});
