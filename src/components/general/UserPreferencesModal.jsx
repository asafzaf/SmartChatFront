import { useState, useEffect } from 'react';

function UserPreferencesModal({ currentPreferences, onSave, onClose }) {
  const [form, setForm] = useState({
    answerStyle: 'Concise',
    exampleCount: 'One',
    tone: 'Neutral'
  });

  useEffect(() => {
    if (currentPreferences) {
      setForm(currentPreferences);
    }
  }, [currentPreferences]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update your preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Answer Style</label>
            <select name="answerStyle" value={form.answerStyle} onChange={handleChange}>
              <option value="Concise">Concise</option>
              <option value="Detailed">Detailed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Example Count</label>
            <select name="exampleCount" value={form.exampleCount} onChange={handleChange}>
              <option value="None">None</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Multiple">Multiple</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tone</label>
            <select name="tone" value={form.tone} onChange={handleChange}>
              <option value="Formal">Formal</option>
              <option value="Casual">Casual</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="send-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserPreferencesModal;
