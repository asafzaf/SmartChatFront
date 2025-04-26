import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend, loading, userData, isNewChat, waitingForResponse }) {
  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        currentUser={userData}
        loading={loading}
        isNewChat={isNewChat}
      />
      <MessageInput onSend={onSend} isNewChat={isNewChat} waitingForResponse={waitingForResponse} />
    </div>
  );
}

export default ChatWindow;
