// src/containers/AuthContainer.jsx
import { useState } from "react";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function AuthContainer() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setError(""); // Clear any errors when flipping the card
  };

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (!result.success) {
      console.error("Login failed:", result);
      setError(result.error);
    }
  };

  const handleSignup = async (userData) => {
    const result = await signup(userData);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="welcome-logo" />
      <div className={`card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-inner">
          <div className="card-front">
            <SignInForm
              handleFlip={handleFlip}
              onSubmit={handleLogin}
              error={error}
            />
          </div>
          <div className="card-back">
            <SignUpForm
              handleFlip={handleFlip}
              onSubmit={handleSignup}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthContainer;
