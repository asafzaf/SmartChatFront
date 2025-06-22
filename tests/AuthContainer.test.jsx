import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthContainer from "../src/containers/AuthContainer";
import { useAuth } from "../src/context/AuthContext";

// for img
jest.mock("../src/assets/logo.png", () => "mock-logo.png");

// for compo
jest.mock("../src/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// for form
jest.mock("../src/components/auth/SignInForm", () => (props) => (
  <div>
    <div>SignIn Form</div>
    <button onClick={() => props.onSubmit("user@example.com", "wrongpass")}>
      Submit Login
    </button>
    <button data-testid="flip-signin" onClick={props.handleFlip}>
      Flip
    </button>
    {props.error && <div data-testid="login-error">{props.error}</div>}
  </div>
));

jest.mock("../src/components/auth/SignUpForm", () => (props) => (
  <div>
    <div>SignUp Form</div>
    <button
      onClick={() =>
        props.onSubmit({ email: "user@example.com", password: "123456" })
      }
    >
      Submit Signup
    </button>
    <button data-testid="flip-signup" onClick={props.handleFlip}>
      Flip
    </button>
    {props.error && <div data-testid="signup-error">{props.error}</div>}
  </div>
));

describe("AuthContainer", () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
    });
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // test 1 Renders SignInForm by default
  test("renders SignInForm initially", () => {
    render(<AuthContainer />);
    expect(screen.getByText("SignIn Form")).toBeInTheDocument();
  });

  // test 2 Flips to SignUpForm when handleFlip is triggered
  test("flips to SignUpForm when handleFlip is called", () => {
    render(<AuthContainer />);
    fireEvent.click(screen.getByTestId("flip-signin"));
    expect(screen.getByText("SignUp Form")).toBeInTheDocument();
  });

  // test 3 Displays login error message if login fails
  test("shows login error if login fails", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: "Invalid credentials",
    });
    render(<AuthContainer />);
    fireEvent.click(screen.getByText("Submit Login"));
    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Invalid credentials"
      );
    });
  });

  // Test 4 Displays signup error message if signup fails
  test("shows signup error if signup fails", async () => {
    mockSignup.mockResolvedValue({
      success: false,
      error: "Email already exists",
    });
    render(<AuthContainer />);
    fireEvent.click(screen.getByTestId("flip-signin")); // flip to signup
    fireEvent.click(screen.getByText("Submit Signup"));
    await waitFor(() => {
      expect(screen.getByTestId("signup-error")).toHaveTextContent(
        "Email already exists"
      );
    });
  });

  // Test 5 Does not display login error when login succeeds
  test("does not show error if login is successful", async () => {
    mockLogin.mockResolvedValue({ success: true });
    render(<AuthContainer />);
    fireEvent.click(screen.getByText("Submit Login"));
    await waitFor(() => {
      expect(screen.queryByTestId("login-error")).not.toBeInTheDocument();
    });
  });

  // Test 6 Clears error message when flipping between forms
  test("clears error when flipping between forms", async () => {
    mockLogin.mockResolvedValue({ success: false, error: "Wrong password" });
    render(<AuthContainer />);
    fireEvent.click(screen.getByText("Submit Login"));
    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Wrong password"
      );
    });
    fireEvent.click(screen.getByTestId("flip-signin"));
    await waitFor(() => {
      expect(screen.queryByTestId("signup-error")).not.toBeInTheDocument();
    });
  });

  // Test 7 Does not display signup error when signup succeeds
  test("does not show signup error if signup is successful", async () => {
    const signupMock = jest.fn(() =>
      Promise.resolve({ success: true, user: { id: "123", username: "test" } })
    );
    useAuth.mockReturnValue({ login: jest.fn(), signup: signupMock });
    render(<AuthContainer />);
    // Flip to signup form
    fireEvent.click(screen.getByTestId("flip-signin"));
    // Trigger signup
    fireEvent.click(screen.getByText("Submit Signup"));
    // Wait for any async updates to settle
    await waitFor(() => {
      expect(screen.queryByTestId("signup-error")).not.toBeInTheDocument();
    });
  });
});
