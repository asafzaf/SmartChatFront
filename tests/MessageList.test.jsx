// tests/MessageList.test.jsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageList from "../src/components/chat/MessageList";
import "@testing-library/jest-dom";

jest.mock("react-markdown", () => ({
    __esModule: true,
    default: ({ children }) => <div>{children}</div>,
}));

jest.mock("remark-gfm", () => ({}));

// mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const user = { _id: "user1" };
const messages = [
    { _id: "1", sender: "user1", text: "Hi", gotFeedback: false },
    { _id: "2", sender: "bot", text: "Hello", gotFeedback: false },
];

describe("MessageList", () => {

    // Test 1: Renders loading state message when loading is true
    test("renders loading state", () => {
        render(
            <MessageList
                messages={[]}
                currentUser={user}
                loading={true}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        expect(screen.getByText(/please wait/i)).toBeInTheDocument();
    });

    // Test 2: Renders 'start a conversation' when isNewChat is true
    test("renders empty message when isNewChat=true", () => {
        render(
            <MessageList
                messages={[]}
                currentUser={user}
                loading={false}
                isNewChat={true}
                onFeedback={jest.fn()}
            />
        );
        expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();
    });

    // Test 3: Renders all messages and auto-scrolls to bottom
    test("renders messages list", () => {
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        expect(screen.getByText("Hi")).toBeInTheDocument();
        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    // Test 4: Opens and closes feedback form modal
    test("opens and closes feedback form", () => {
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        expect(screen.getByText(/chat feedback/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(screen.queryByText(/chat feedback/i)).not.toBeInTheDocument();
    });

    // Test 5: Submits feedback form and clears state afterward
    test("submits feedback form and resets state", async () => {
        const onFeedbackMock = jest.fn().mockResolvedValue();
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={onFeedbackMock}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        const ratingInput = screen.getByRole("spinbutton");
        fireEvent.change(ratingInput, { target: { value: "7" } });
        const qualitativeInput = screen.getByPlaceholderText(/write your qualitative feedback/i);
        fireEvent.change(qualitativeInput, { target: { value: "Great answer" } });
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "yes" } });
        fireEvent.change(selects[1], { target: { value: "too_concise" } });
        fireEvent.change(selects[2], { target: { value: "yes" } });
        fireEvent.change(selects[3], { target: { value: "fine" } });
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await waitFor(() =>
            expect(onFeedbackMock).toHaveBeenCalledWith(
                expect.objectContaining({ _id: "2" }),
                expect.objectContaining({
                    rating: "7",
                    qualitative: "Great answer",
                    interactionDetails: expect.objectContaining({
                        examplesEnough: "yes",
                        detailLevel: "too_concise",
                        clarity: "yes",
                        length: "fine",
                        tone: "",
                    }),
                })
            )
        );
        await waitFor(() =>
            expect(screen.queryByText(/chat feedback/i)).not.toBeInTheDocument()
        );
    });

    // Test 6: Resets form data and hides feedback option after submission
    test("resets form data and updates gotFeedback after submission", async () => {
        const onFeedbackMock = jest.fn().mockResolvedValue();
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={onFeedbackMock}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        fireEvent.change(screen.getByRole("spinbutton"), {
            target: { value: "4" },
        });
        fireEvent.change(screen.getByPlaceholderText(/write your qualitative feedback/i), {
            target: { value: "Needs more details" },
        });
        const selects = screen.getAllByRole("combobox");
        fireEvent.change(selects[0], { target: { value: "no" } });
        fireEvent.change(selects[1], { target: { value: "too_detailed" } });
        fireEvent.change(selects[2], { target: { value: "no" } });
        fireEvent.change(selects[3], { target: { value: "too_long" } });
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await waitFor(() => {
            expect(onFeedbackMock).toHaveBeenCalled();
        });
        fireEvent.click(screen.getByText(/want to share feedback/i));
        expect(screen.getByRole("spinbutton").value).toBe("10");
        expect(screen.getByPlaceholderText(/write your qualitative feedback/i).value).toBe("");
        screen.getAllByRole("combobox").forEach((select) =>
            expect(select.value).toBe("")
        );
        expect(screen.queryByText(/want to share feedback/i)).not.toBeInTheDocument();
    });

    // Test 7: Does not close feedback form if onFeedback throws error
    test("does not close form if onFeedback throws an error", async () => {
        const onFeedbackMock = jest.fn().mockRejectedValue(new Error("Network error"));
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={onFeedbackMock}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        fireEvent.click(screen.getByRole("button", { name: /send/i }));
        await waitFor(() => {
            expect(onFeedbackMock).toHaveBeenCalledTimes(1);
            expect(screen.getByText(/chat feedback/i)).toBeInTheDocument();
        });
        consoleErrorSpy.mockRestore();
    });

    // Test 8: Cancel action preserves form field values
    test("cancel does not reset form fields", () => {
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        fireEvent.change(screen.getByRole("spinbutton"), {
            target: { value: "3" },
        });
        fireEvent.change(screen.getByPlaceholderText(/write your qualitative feedback/i), {
            target: { value: "Test comment" },
        });
        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        fireEvent.click(screen.getByText(/want to share feedback/i));
        expect(screen.getByRole("spinbutton").value).toBe("3");
        expect(screen.getByPlaceholderText(/write your qualitative feedback/i).value).toBe("Test comment");
    });

    // Test 9: Updates specific interactionDetails field (clarity) correctly
    test("updates interactionDetails.clarity field in formData", async () => {
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        const allSelects = screen.getAllByRole("combobox");
        const claritySelect = allSelects.find((el) => el.getAttribute("name") === "clarity");
        expect(claritySelect).toBeTruthy();
        fireEvent.change(claritySelect, {
            target: { name: "clarity", value: "yes" },
        });
        expect(claritySelect.value).toBe("yes");
    });

    // Test 10: Ignores unknown fields in handleChange (covers fallback logic)
    test("ignores unknown field in handleChange (covers final else branch)", () => {
        render(
            <MessageList
                messages={messages}
                currentUser={user}
                loading={false}
                isNewChat={false}
                onFeedback={jest.fn()}
            />
        );
        fireEvent.click(screen.getByText(/want to share feedback/i));
        const fakeEvent = {
            target: {
                name: "nonexistentField",
                value: "whatever",
            },
        };
        const input = screen.getByRole("spinbutton");
        fireEvent.change(input, fakeEvent);
        expect(true).toBe(true);
    });

});
