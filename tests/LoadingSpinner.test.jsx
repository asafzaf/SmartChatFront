// tests/LoadingSpinner.test.jsx

import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../src/components/general/LoadingSpinner";

describe("LoadingSpinner", () => {
    
    // Test 1: Renders the loading spinner and loading message
    test("renders spinner and message", () => {
        render(<LoadingSpinner />);
        expect(screen.getByText(/please wait/i)).toBeInTheDocument();
        expect(document.querySelector(".loading-spinner")).toBeInTheDocument();
        expect(document.querySelector(".loading-container")).toBeInTheDocument();
    });

});
