import { useState } from "react";
// import { updateUser } from "../../api/user";
import { useAuth } from "../../context/AuthContext";

function UserPreferencesModal({ data, onClose }) {
  console.log("User data:", data);

  const { syncUpdateUser } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    first_name: data.first_name || "",
    last_name: data.last_name || "",
    email: data.email || "",
    role: data.role || "",
    expertiseLevel: data.expertiseLevel || "",
    preferences: {
      answerStyle: data.preferences?.answerStyle || "",
      exampleCount: data.preferences?.exampleCount || "",
      tone: data.preferences?.tone || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.preferences) {
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [name]: value,
        },
      });
    } else if (name in formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data to be sent:", formData);

    if (newPassword) setFormData({ ...formData, password: newPassword });
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await syncUpdateUser(formData, data._id);
      if (response.error) {
        console.error("Failed to update user:", response.error);
        return;
      }
      console.log("User updated successfully:", response);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Settings</h2>
        <form onSubmit={handleSubmit}>
          <div
            className="form-columns"
            style={{ display: "flex", gap: "2rem" }}
          >
            {/* Left Column: Information */}
            <div className="form-column">
              <h3 className="form-sub-title">Information</h3>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>
                  Password:
                  <input
                    type="password"
                    name="password"
                    value={newPassword}
                    placeholder="Leave blank to keep current password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Confirm Password:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="Leave blank to keep current password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Student">Student</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Software Engineer">Software Engineer</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Expertise Level:
                  <select
                    name="expertiseLevel"
                    value={formData.expertiseLevel}
                    onChange={handleChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </label>
              </div>
            </div>
            {/* Right Column: Preferences */}
            <div className="form-column">
              <h3 className="form-sub-title">Preferences</h3>
              <div className="form-group">
                <label>Answer Style</label>
                <select
                  name="answerStyle"
                  value={formData.preferences.answerStyle}
                  onChange={handleChange}
                >
                  <option value="Concise">Concise</option>
                  <option value="Detailed">Detailed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Example Count</label>
                <select
                  name="exampleCount"
                  value={formData.preferences.exampleCount}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="One">One</option>
                  <option value="Two">Two</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tone</label>
                <select
                  name="tone"
                  value={formData.preferences.tone}
                  onChange={handleChange}
                >
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>
            </div>
          </div>
          {/* Form buttons */}
          <div className="modal-actions" style={{ marginTop: "2rem" }}>
            <button type="submit" className="send-btn">
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPreferencesModal;
