// tests/App.test.jsx

import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { useAuth } from "../src/context/AuthContext";

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

describe("App", () => {
    // test 1 Checks that App renders LoadingSpinner when loading
    test("renders LoadingSpinner when loading", () => {
        useAuth.mockReturnValue({ loading: true, currentUser: null });
        render(<App />);
        expect(screen.getByText("LoadingSpinner")).toBeInTheDocument();
    });

    // test 2 Checks that App renders AppContainer when user is logged in
    test("renders AppContainer when user is logged in", () => {
        useAuth.mockReturnValue({ loading: false, currentUser: { _id: "user123" } });
        render(<App />);
        expect(screen.getByText("AppContainer")).toBeInTheDocument();
    });

    // test 3 Checks that App renders AuthContainer when user is not logged in
    test("renders AuthContainer when user is not logged in", () => {
        useAuth.mockReturnValue({ loading: false, currentUser: null });
        render(<App />);
        expect(screen.getByText("AuthContainer")).toBeInTheDocument();
    });
    
});
