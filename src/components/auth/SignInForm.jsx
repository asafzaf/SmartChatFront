// src/components/SignInForm.jsx
import { useState } from "react";
import FormButton from "./FormButton";
import LoadingSpinner from "../general/LoadingSpinner";

function SignInForm({ handleFlip, onSubmit, error }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return; // Form validation is handled by required attributes
    }

    setLoading(true);
    await onSubmit(formData.email, formData.password);
    setLoading(false);
  };

  return (
    <>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <FormButton
          text={loading ? "Signing In..." : "Sign In"}
          disabled={loading}
        />
        {loading && <LoadingSpinner />}
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={handleFlip} className="flip-btn" disabled={loading}>
          Sign Up
        </button>
      </p>
    </>
  );
}

export default SignInForm;
