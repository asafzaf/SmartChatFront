// tests/FormButton.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import FormButton from "../src/components/auth/FormButton";

describe("FormButton", () => {

    // Test 1: Renders button without crashing even if no onClick handler is provided
    test("renders button without onClick handler", () => {
        render(<FormButton text="No Action" />);
        const button = screen.getByRole("button", { name: /no action/i });
        expect(button).toBeInTheDocument();
    });

    // Test 2: Renders button with provided text
    test("renders button with given text", () => {
        render(<FormButton text="Submit" />);
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    // Test 3: Calls onClick when button is clicked
    test("calls onClick when clicked", () => {
        const handleClick = jest.fn();
        render(<FormButton text="Click Me" onClick={handleClick} />);
        fireEvent.click(screen.getByText("Click Me"));
        expect(handleClick).toHaveBeenCalled();
    });

    // Test 4: Button is disabled when disabled prop is true and does not trigger onClick
    test("button is disabled when disabled=true", () => {
        const handleClick = jest.fn();
        render(<FormButton text="Don't Click" onClick={handleClick} disabled={true} />);
        const button = screen.getByRole("button", { name: /don't click/i });
        expect(button).toBeDisabled();
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled(); // Ensure onClick is not called when disabled
    });
    
});
