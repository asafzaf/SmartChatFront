import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend, onFeedback, loading, userData, isNewChat, waitingForResponse }) {
  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        currentUser={userData}
        loading={loading}
        isNewChat={isNewChat}
        onFeedback={onFeedback}
      />
      <MessageInput onSend={onSend} isNewChat={isNewChat} waitingForResponse={waitingForResponse} />
    </div>
  );
}

export default ChatWindow;
