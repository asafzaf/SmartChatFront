import { useState, useEffect, useRef } from "react";
import MessageComponent from "./MessageComponent";
import LoadingSpinner from "../general/LoadingSpinner";

function MessageList({
  messages,
  currentUser,
  loading,
  isNewChat,
  onFeedback,
}) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [localMessages, setLocalMessages] = useState(messages);
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

  useEffect(() => {
    setLocalMessages(messages);
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
    try {
      await onFeedback(selectedMessage, formData);
      if (selectedMessage?._id) {
        console.log("Message marked as feedback given:", selectedMessage._id);
      }
      setLocalMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === selectedMessage._id ? { ...msg, gotFeedback: true } : msg
        )
      );

      setSelectedMessage(null);
      setFormData({
        rating: 10,
        qualitative: "",
        interactionDetails: {
          examplesEnough: "",
          detailLevel: "",
          clarity: "",
          tone: "",
          length: "",
        },
      });
    } catch (err) {
      console.error("Error submitting feedback and marking message:", err);
    }
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
        <div className="no-messages">Start a conversation!</div>
      ) : (
        <>
          {localMessages.map((msg, index) => (
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
      {/* Feedback Model Form */}
      {selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chat Feedback</h2>
            <form onSubmit={handleSubmitForm}>
              <div className="model-filed">
                <label>How would you rate this answer? </label>
                <label className="rating-label">
                  (1 = very bad, 10 = very good)
                </label>
                <input
                  className="rating-input"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rating}
                  name="rating"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="model-filed">
                <label>Any feedback you'd like to share? (optional)</label>
                <textarea
                  value={formData.qualitative}
                  name="qualitative"
                  onChange={handleChange}
                  placeholder="Write your qualitative feedback here"
                />
              </div>
              <div className="model-filed model-files-secondary">
                <label>Were there enough examples?</label>
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
                <label>Was the answer detailed enough?</label>
                <select
                  name="detailLevel"
                  value={formData.interactionDetails.detailLevel}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    -- Select --
                  </option>
                  <option value="too_concise">Yes</option>
                  <option value="too_detailed">No</option>
                </select>
              </div>
              <div className="model-filed model-files-secondary">
                <label>Was the answer clear?</label>
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
                <label>
                  Was it too long? Would you prefer something shorter?{" "}
                </label>
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
