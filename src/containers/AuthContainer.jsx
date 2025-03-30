// src/containers/AuthContainer.jsx
import { useState } from "react";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";

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
      <div className={`card ${isFlipped ? "flipped" : ""}`}>
        <div className="card-inner">
          <div className="card-front">
            <img src={logo} alt="Logo" className="logo" />
            <SignInForm
              handleFlip={handleFlip}
              onSubmit={handleLogin}
              error={error}
            />
          </div>
          <div className="card-back">
            <img src={logo} alt="Logo" className="logo" />

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
