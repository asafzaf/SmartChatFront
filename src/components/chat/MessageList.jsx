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
  }, [localMessages]);

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
    try {
      console.log("Feedback:\n", formData); // TBD
      await onFeedback(selectedMessage, formData);
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
          <div className="feedback-modal modal-content">
            <h2>Chat Feedback</h2>
            <form onSubmit={handleSubmitForm}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <div className="form-group">
                    <label>How would you rate this answer? </label>
                    <label style={{ fontSize: "0.8rem" }}>
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
                      style={{ width: "350px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Any feedback you'd like to share? (optional)</label>
                    <textarea
                      value={formData.qualitative}
                      name="qualitative"
                      onChange={handleChange}
                      placeholder="Write your qualitative feedback here"
                      style={{ width: "350px" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="form-group model-filed-secondary">
                    <label>Were there enough examples?</label>
                    <select
                      name="examplesEnough"
                      value={formData.interactionDetails.examplesEnough}
                      onChange={handleChange}
                      style={{ width: "350px" }}
                    >
                      <option value="" disabled hidden>
                        -- Select --
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="form-group model-filed-secondary">
                    <label>Was the answer detailed enough?</label>
                    <select
                      name="detailLevel"
                      value={formData.interactionDetails.detailLevel}
                      onChange={handleChange}
                      style={{ width: "350px" }}
                    >
                      <option value="" disabled hidden>
                        -- Select --
                      </option>
                      <option value="too_concise">Yes</option>
                      <option value="too_detailed">No</option>
                    </select>
                  </div>
                  <div className="form-group model-filed-secondary">
                    <label>Was the answer clear?</label>
                    <select
                      name="clarity"
                      value={formData.interactionDetails.clarity}
                      onChange={handleChange}
                      style={{ width: "350px" }}
                    >
                      <option value="" disabled hidden>
                        -- Select --
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="form-group model-filed-secondary">
                    <label>
                      Was it too long? Would you prefer something shorter?{" "}
                    </label>
                    <select
                      name="length"
                      value={formData.interactionDetails.length}
                      onChange={handleChange}
                      aria-placeholder="Select length"
                      style={{ width: "350px" }}
                    >
                      <option value="" disabled hidden>
                        -- Select --
                      </option>
                      <option value="too_short">Too Short</option>
                      <option value="too_long">Too Long</option>
                      <option value="fine">Just fine</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="modal-actions feedback-modal-actions"
                style={{ paddingRight: "14px" }}
              >
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
