// tests/SignUpForm.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // כבר לא צריך את act ישירות
import SignUpForm from "../src/components/auth/SignUpForm";

describe("SignUpForm", () => {
    // Test 1: Renders step 1 and shows validation error for mismatched passwords
    test("renders step 1 and shows validation error for mismatched passwords", async () => {
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123456" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "654321" },
        });
        fireEvent.click(screen.getByText("Next"));
        expect(
            await screen.findByText("Passwords do not match")
        ).toBeInTheDocument();
    });

    // Test 2: Progresses through steps and submits final data
    test("progresses through steps and submits final data", async () => {
        const mockSubmit = jest.fn();
        render(<SignUpForm onSubmit={mockSubmit} handleFlip={jest.fn()} />);
        // Step 1: Account Details
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123456" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByText("Next"));

        // Step 2: Personal Information
        await waitFor(() => screen.getByLabelText("First Name"));
        fireEvent.change(screen.getByLabelText("First Name"), {
            target: { value: "Nave" },
        });
        fireEvent.change(screen.getByLabelText("Last Name"), {
            target: { value: "Maymon" },
        });
        fireEvent.change(screen.getByLabelText("Role"), {
            target: { value: "Student" },
        });
        fireEvent.change(screen.getByLabelText("Expertise Level"), {
            target: { value: "Beginner" },
        });
        fireEvent.click(screen.getByText("Next"));

        // Step 3: Preferences
        await waitFor(() => screen.getByLabelText("Answer Style"));
        fireEvent.change(screen.getByLabelText("Answer Style"), {
            target: { value: "Concise" },
        });
        fireEvent.change(screen.getByLabelText("Example Count"), {
            target: { value: "One" },
        });
        fireEvent.change(screen.getByLabelText("Tone"), {
            target: { value: "Neutral" },
        });
        fireEvent.click(screen.getByText("Complete Sign Up"));

        await waitFor(() =>
            expect(mockSubmit).toHaveBeenCalledWith({
                email: "user@example.com",
                password: "123456",
                first_name: "Nave",
                last_name: "Maymon",
                role: "Student",
                preferences: {
                    answerStyle: "Concise",
                    exampleCount: "One",
                    tone: "Neutral",
                },
                expertiseLevel: "Beginner",
            })
        );
    });

    // Test 3: Calls handleFlip when Sign In is clicked
    test("calls handleFlip when Sign In is clicked", () => {
        const mockFlip = jest.fn();
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={mockFlip} />);
        fireEvent.click(screen.getByText("Sign In"));
        expect(mockFlip).toHaveBeenCalled();
    });

    // Test 4: Shows server error message if error prop is passed
    test("shows server error message if error prop is passed", () => {
        render(
            <SignUpForm
                onSubmit={jest.fn()}
                handleFlip={jest.fn()}
                error="Email already exists"
            />
        );
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });

    // Test 5: Goes back a step when Back button is clicked
    test("goes back a step when Back button is clicked", async () => {
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        // Step 1
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123456" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByText("Next"));
        // Step 2
        await waitFor(() => screen.getByLabelText("First Name"));
        fireEvent.click(screen.getByText("Back"));

        expect(screen.getByLabelText("Email")).toBeInTheDocument(); // return to Step 1
    });

    // Test 6: Covers password mismatch logic then clears it
    test("covers password mismatch logic then clears it", async () => {
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        // Trigger error
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123456" },
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "000000" },
        });
        fireEvent.click(screen.getByText("Next"));
        const errorMessage = await screen.findByText("Passwords do not match");
        expect(errorMessage).not.toBeNull();
        expect(errorMessage.tagName).toBe("DIV");
        expect(errorMessage.className).toMatch(/error-message/);
        expect(errorMessage).toBeInTheDocument();
        // Clear error and proceed
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByText("Next"));
        await waitFor(() => {
            expect(screen.queryByText("Passwords do not match")).not.toBeInTheDocument();
        });
        expect(await screen.findByLabelText("First Name")).toBeInTheDocument();
    });

    // Test 7: Shows error if password is less than 6 characters
    test("shows error if password is less than 6 characters", async () => {
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "user@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "123" }, // less than 6 characters
        });
        fireEvent.change(screen.getByLabelText("Confirm Password"), {
            target: { value: "123" }, // less than 6 characters
        });
        fireEvent.click(screen.getByText("Next"));
        const errorMessage = await screen.findByText("Password must be at least 6 characters");
        expect(errorMessage).toBeInTheDocument();
    });

    // Test 8: Renders headings for all steps (1, 2, 3) - comprehensive flow
    test("renders headings for all steps (1, 2, 3)", async () => {
        render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        expect(screen.getByText("Account Details")).toBeInTheDocument(); // Step 1
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "a@b.com" } });
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123456" } });
        fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "123456" } });
        fireEvent.click(screen.getByText("Next"));
        await waitFor(() =>
            expect(screen.getByText("Personal Information")).toBeInTheDocument() // Step 2
        );
        fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "N" } });
        fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "M" } });
        fireEvent.change(screen.getByLabelText("Role"), { target: { value: "Student" } });
        fireEvent.change(screen.getByLabelText("Expertise Level"), { target: { value: "Beginner" } });
        fireEvent.click(screen.getByText("Next"));
        await waitFor(() =>
            expect(screen.getByText("Preferences")).toBeInTheDocument() // Step 3
        );
    });

    // Test 9: Covers renderStepHeading default case (line 107) using module mock
    test("covers renderStepHeading default case (line 107) using module mock", () => {
        // Mock the React.useState to control the currentStep state
        const originalUseState = React.useState;
        let mockState = 999; // Force currentStep to 999
        let mockSetState = jest.fn(newState => { mockState = newState; });
        // Temporarily override React.useState
        React.useState = jest.fn((initialValue) => {
            // If this is the currentStep state (usually initialized to 1),
            // return our mocked value.
            if (initialValue === 1) {
                return [mockState, mockSetState];
            }
            // For other useState calls, use the original React.useState
            return originalUseState(initialValue);
        });
        // Render the component with our mocked useState
        const { container } = render(<SignUpForm onSubmit={jest.fn()} handleFlip={jest.fn()} />);
        // Since currentStep is mocked to 999, renderStepHeading should return null,
        // and thus no <h3> should be in the document.
        const heading = container.querySelector("h3");
        expect(heading).toBeNull();
        // Restore React.useState to its original implementation for other tests
        React.useState = originalUseState;
    });

});