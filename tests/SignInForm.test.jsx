import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInForm from "../src/components/auth/SignInForm";

describe("SignInForm", () => {
  const mockOnSubmit = jest.fn(() => Promise.resolve());
  const mockHandleFlip = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockHandleFlip.mockClear();
  });

  // Test 1: Submits form with correct email and password values
  test("renders Sign In form and submits with correct data", async () => {
    render(
      <SignInForm
        onSubmit={mockOnSubmit}
        handleFlip={mockHandleFlip}
        error=""
      />
    );
    expect(
      screen.getByRole("heading", { name: "Sign In" })
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("user@example.com", "123456");
    });
  });

  // Test 2: Displays error message when error prop is provided
  test("shows error message if error prop is passed", () => {
    render(
      <SignInForm
        onSubmit={mockOnSubmit}
        handleFlip={mockHandleFlip}
        error="Login failed"
      />
    );
    const errorElement = screen.getByText("Login failed");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).not.toBeNull(); // for coverage
    expect(errorElement.tagName).toBe("DIV"); // full call for coverage
  });

  // Test 3: Calls handleFlip when 'Sign Up' button is clicked
  test("calls handleFlip when Sign Up button is clicked", () => {
    render(
      <SignInForm
        onSubmit={mockOnSubmit}
        handleFlip={mockHandleFlip}
        error=""
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    expect(mockHandleFlip).toHaveBeenCalled();
  });

  // Test 4: Does not call onSubmit if both email and password are empty
  test("covers return false if email and password are empty (line 24)", async () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <SignInForm onSubmit={onSubmit} handleFlip={() => {}} error="" />
    );
    const form = container.querySelector("form");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
