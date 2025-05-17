import { useState, useEffect, useRef } from "react";
import MessageComponent from "./MessageComponent";
import LoadingSpinner from "../general/LoadingSpinner";

import { sendFeedback } from "../../api/feedback.js";

function MessageList({
  messages,
  currentUser,
  loading,
  isNewChat,
  onFeedback,
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    qualitative: "",
    interactionDetails: {
      examplesEnough: "",
      detailLevel: "",
      clarity: "",
      tone: "",
      length: "",
    },
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpenForm = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseForm = () => {
    setSelectedMessage(null);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    await onFeedback(formData);
    setSelectedMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name in formData.interactionDetails) {
      setFormData({
        ...formData,
        interactionDetails: {
          ...formData.interactionDetails,
          [name]: value,
        },
      });
    }
  };

  return (
    <div className="message-list">
      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 || isNewChat ? (
        <div className="no-messages">
          No messages yet. Start a conversation!
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <MessageComponent
              key={`${msg._id}-${index}`}
              message={msg}
              currentUser={currentUser}
              handleOpenForm={handleOpenForm}
              index={index}
            />
          ))}
          <div ref={bottomRef} />
        </>
      )}

      {selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chat Feedback</h2>
            <form onSubmit={handleSubmitForm}>
              <div className="model-filed">
                <label>Rate the response from 1 to 10:</label>
                <input
                  className="rating-input"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rating}
                  name="rating"
                  onChange={handleChange}
                  placeholder="Enter a number between 1 and 10"
                  required
                />
              </div>
              <div className="model-filed">
                <label>Add free text feedback:</label>
                <textarea
                  value={formData.qualitative}
                  name="qualitative"
                  onChange={handleChange}
                  placeholder="Write your qualitative feedback here"
                />
              </div>
              <div className="model-filed model-files-secondary">
                <label>Are there enough examples?</label>
                <select
                  name="examplesEnough"
                  value={formData.interactionDetails.examplesEnough}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="model-filed model-files-secondary">
                <label>How is the level of detail?</label>
                <select
                  name="detailLevel"
                  value={formData.interactionDetails.detailLevel}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="too_concise">Too Concise</option>
                  <option value="too_detailed">Too Detailed</option>
                </select>
              </div>
              <div className="model-filed model-files-secondary">
                <label>Is the answer clear ?</label>
                <select
                  name="clarity"
                  value={formData.interactionDetails.clarity}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="model-filed model-files-secondary">
                <label>Which tone do you prefer?</label>
                <select
                  name="tone"
                  value={formData.interactionDetails.tone}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              <div className="model-filed model-files-secondary">
                <label>How was the length of the answer?</label>
                <select
                  name="length"
                  value={formData.interactionDetails.length}
                  onChange={handleChange}
                  aria-placeholder="Select length"
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="too_short">Too Short</option>
                  <option value="too_long">Too Long</option>
                  <option value="fine">Just fine</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="send-btn">
                  Send
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
