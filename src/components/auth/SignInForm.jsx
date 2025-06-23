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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    setLoading(true);
    await onSubmit(formData.email, formData.password);
    setLoading(false);
  };

  return (
    <>
      <h2>Sign In</h2>
      <form className="sign-in-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="sign-in-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="sign-in-email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ textAlign: "center" }}
          />
        </div>
        <div className="sign-in-input">
          <label htmlFor="sign-in-password">Password</label>
          <input
            type="password"
            id="sign-in-password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ textAlign: "center" }}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <FormButton
            text={loading ? "Signing In..." : "Sign In"}
            disabled={loading}
          />
          {loading && <LoadingSpinner />}
        </div>
      </form>
      <p className="flip-text">
        Don't have an account?{" "}
        <button onClick={handleFlip} className="flip-btn" disabled={loading}>
          Sign Up
        </button>
      </p>
    </>
  );
}

export default SignInForm;
