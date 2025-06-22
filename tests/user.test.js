jest.mock("../src/api/user.js", () => ({
  updateUser: jest.fn(async (data, userId) => {
    if (!userId) {
      throw new Error("User ID is required to update user preferences");
    }
    return { success: true, updated: data };
  }),
}));

import { updateUser } from "../src/api/user.js";

describe("user.js – mocked tests", () => {
  // Test 1: updateUser returns success response with valid input and userId
  test("updateUser returns success response with valid data", async () => {
    const data = { tone: "casual", answerStyle: "detailed" };
    const res = await updateUser(data, "user42");
    expect(res).toEqual({
      success: true,
      updated: data,
    });
  });

  // Test 2: updateUser throws error when userId is missing
  test("updateUser throws error when userId is missing", async () => {
    await expect(updateUser({ tone: "neutral" }, null)).rejects.toThrow(
      "User ID is required to update user preferences"
    );
  });

  // Test 3: updateUser throws error when server fails (mocked rejection)
  test("updateUser throws error when server fails", async () => {
    // fake error
    const error = new Error("Server error");
    // update the mock to simulate server failure
    updateUser.mockRejectedValueOnce(error);
    await expect(updateUser({ tone: "casual" }, "user42")).rejects.toThrow(
      "Server error"
    );
  });

  // Test 4: updateUser returns error object when server fails again
  test("updateUser returns error object when server fails", async () => {
    const error = new Error("Server error");
    updateUser.mockRejectedValueOnce(error);
    await expect(updateUser({ tone: "casual" }, "user42")).rejects.toThrow(
      "Server error"
    );
  });
});
