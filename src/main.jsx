import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

function AppContainer() {
  return (
    <Router>
      <Routes>
        {/* Main chat page */}
        <Route path="/" element={<App />} />

        {/* Redirect all other routes to '/' */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
  </StrictMode>
);
