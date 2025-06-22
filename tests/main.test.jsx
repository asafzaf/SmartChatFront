import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { useAuth } from "../src/context/AuthContext";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
  process.env.VITE_API_URL = "http://localhost:3000";
});

jest.mock("../src/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../src/containers/AppContainer", () => () => (
  <div>AppContainer</div>
));
jest.mock("../src/containers/AuthContainer", () => () => (
  <div>AuthContainer</div>
));
jest.mock("../src/components/general/LoadingSpinner", () => () => (
  <div>LoadingSpinner</div>
));

describe("Main.jsx integration", () => {
  // Test 1: Renders LoadingSpinner when loading is true
  test("renders loading state", () => {
    useAuth.mockReturnValue({ loading: true, currentUser: null });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();
  });

  // Test 2: Renders AppContainer when user is authenticated
  test("renders AppContainer if user is authenticated", () => {
    useAuth.mockReturnValue({ loading: false, currentUser: { _id: "123" } });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("AppContainer")).toBeInTheDocument();
  });

  // Test 3: Renders AuthContainer when user is not authenticated
  test("renders AuthContainer if user is not authenticated", () => {
    useAuth.mockReturnValue({ loading: false, currentUser: null });
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("AuthContainer")).toBeInTheDocument();
  });
});
