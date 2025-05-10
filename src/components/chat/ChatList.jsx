import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

function ChatList({
  onSelectChat,
  selectedChatId,
  onCreateChat,
  onDeleteChat,
  chats,
  loading,
}) {
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);

  return (
    <div className="chat-list">
      <div className="chats-header">
        <h2 className="chats-title">Chats</h2>
        <button onClick={onCreateChat} className="new-chat-btn">
          New Chat
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p>No chats found</p>
      ) : (
        <div className="chat-list-container">
          {chats.map((chat, index) => (
            <div
              key={chat._id}
              className="chat-list-item"
              onMouseEnter={() => setHoveredChatId(chat._id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              {chat.hasNewMessages && ( // TO_ELIYA: add new message icon
                <IoMdMail className="new-message-icon" title="New messages" color="red" />
              )}
              <button
                onClick={() => onSelectChat(chat._id)}
                className={`${
                  chat._id === selectedChatId ? "selected-chat-btn" : "chat-btn"
                }`}
              >
                {chat.title || `Chat ${index + 1}`}
              </button>

              {hoveredChatId === chat._id && (
                <FaTrash
                  className="trash-icon"
                  onClick={() => setChatToDelete(chat)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {chatToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p>Are you sure you want to delete this chat?</p>
            <div className="modal-buttons">
              <button
                className="delete-btn"
                onClick={() => {
                  onDeleteChat(chatToDelete._id); // delete from DB
                  setChatToDelete(null); // close modal
                }}
              >
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setChatToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatList;
