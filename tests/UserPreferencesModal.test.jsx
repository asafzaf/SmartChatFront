import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserPreferencesModal from "../src/components/general/UserPreferencesModal";
import { useAuth } from "../src/context/AuthContext";

jest.mock("../src/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("UserPreferencesModal", () => {
  const mockSyncUpdateUser = jest.fn();
  const mockOnClose = jest.fn();

  const userData = {
    _id: "user123",
    first_name: "Alice",
    last_name: "Wonder",
    email: "alice@example.com",
    role: "Student",
    expertiseLevel: "Beginner",
    preferences: {
      answerStyle: "Concise",
      exampleCount: "One",
      tone: "Formal",
    },
  };

  const mockAuthContextValue = {
    syncUpdateUser: mockSyncUpdateUser,
  };

  beforeEach(() => {
    useAuth.mockReturnValue(mockAuthContextValue);
    mockSyncUpdateUser.mockClear();
    mockOnClose.mockClear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Renders modal fields with initial user data
  test("renders with user data", () => {
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Wonder")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Student")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Beginner")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Concise")).toBeInTheDocument();
  });

  // Test 2: Updates user preferences and submits successfully
  test("updates preferences and submits", async () => {
    mockSyncUpdateUser.mockResolvedValue({});
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    fireEvent.change(screen.getByDisplayValue("Concise"), {
      target: { name: "answerStyle", value: "Detailed" },
    });
    fireEvent.change(screen.getByDisplayValue("One"), {
      target: { name: "exampleCount", value: "Multiple" },
    });
    fireEvent.change(screen.getByDisplayValue("Formal"), {
      target: { name: "tone", value: "Casual" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(mockSyncUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          preferences: {
            answerStyle: "Detailed",
            exampleCount: "Multiple",
            tone: "Casual",
          },
        }),
        "user123"
      );
    });
  });

  // Test 3: Updates personal fields and submits successfully
  test("updates personal fields and submits", async () => {
    mockSyncUpdateUser.mockResolvedValue({});
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    fireEvent.change(screen.getByDisplayValue("Alice"), {
      target: { name: "first_name", value: "Alicia" },
    });
    fireEvent.change(screen.getByDisplayValue("Student"), {
      target: { name: "role", value: "Lecturer" },
    });
    fireEvent.change(screen.getByDisplayValue("Beginner"), {
      target: { name: "expertiseLevel", value: "Advanced" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(mockSyncUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Alicia",
          role: "Lecturer",
          expertiseLevel: "Advanced",
        }),
        "user123"
      );
    });
  });

  // Test 4: Handles field NOT in preferences AND NOT in formData
  test("covers line 34 - handles field NOT in preferences AND NOT in formData", () => {
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    // Get any input element
    const emailInput = screen.getByDisplayValue("alice@example.com");
    // Create an event with a field name that doesn't exist in either formData or preferences
    // This should trigger the implicit "else" case (do nothing)
    fireEvent.change(emailInput, {
      target: {
        name: "nonExistentField", // This field doesn't exist in formData or preferences
        value: "someValue",
      },
    });
    // The value should remain unchanged since the field doesn't exist
    expect(emailInput.value).toBe("alice@example.com");
  });

  // test 4.1 : covers line 34 - handles field in formData but NOT in preferences
  test("covers exact else if condition", () => {
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    // Test a field that's definitely in formData but NOT in preferences
    const emailInput = screen.getByDisplayValue("alice@example.com");
    // This should specifically trigger: else if (name in formData)
    fireEvent.change(emailInput, {
      target: {
        name: "email", // email is in formData root, not in formData.preferences
        value: "test34@example.com",
      },
    });
    expect(emailInput.value).toBe("test34@example.com");
    // Also test with other direct formData fields
    const roleSelect = screen.getByDisplayValue("Student");
    fireEvent.change(roleSelect, {
      target: {
        name: "role", // role is in formData root, not in formData.preferences
        value: "Lecturer",
      },
    });
    expect(roleSelect.value).toBe("Lecturer");
  });

  // Test 5: Shows error and blocks submit if passwords do not match
  test("shows error if passwords do not match", async () => {
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    const passwordInputs = screen.getAllByLabelText(/password/i);
    const passwordInput = passwordInputs.find(
      (input) => input.name === "password"
    );
    const confirmPasswordInput = passwordInputs.find(
      (input) => input.name === "confirmPassword"
    );
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "654321" } });
    fireEvent.click(screen.getByText("Save"));
    expect(mockSyncUpdateUser).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Passwords do not match");
  });

  // Test 6: Calls onClose when Cancel is clicked
  test("calls onClose when Cancel clicked", () => {
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  // Test 7: Shows error if syncUpdateUser returns an error object
  test("shows error if updateUser returns error", async () => {
    mockSyncUpdateUser.mockResolvedValue({ error: "server error" });
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    fireEvent.change(screen.getByDisplayValue("Alice"), {
      target: { name: "first_name", value: "Updated" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to update user:",
        "server error"
      );
    });
  });

  // Test 8: Catches and logs unexpected error from syncUpdateUser
  test("catches and logs unexpected error in catch block", async () => {
    const mockError = new Error("unexpected error");
    mockSyncUpdateUser.mockRejectedValue(mockError);
    render(<UserPreferencesModal data={userData} onClose={mockOnClose} />);
    fireEvent.change(screen.getByDisplayValue("Alice"), {
      target: { name: "first_name", value: "Updated" },
    });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to update user:",
        mockError
      );
    });
  });

  // Test 9: Renders correctly even if some fields are missing from user data
  test("renders correctly when data fields are missing", () => {
    render(<UserPreferencesModal data={{}} onClose={mockOnClose} />);
    const textInputs = screen.getAllByRole("textbox");
    textInputs.forEach((input) => {
      expect(input).toHaveValue("");
    });
    const passwordFields = screen.getAllByPlaceholderText(
      /keep current password/i
    );
    passwordFields.forEach((input) => {
      expect(input).toHaveValue("");
    });
    expect(screen.getByDisplayValue("Student")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Beginner")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Concise")).toBeInTheDocument();
    expect(screen.getByDisplayValue("None")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Formal")).toBeInTheDocument();
  });
});
