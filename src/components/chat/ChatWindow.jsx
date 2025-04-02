import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend, userData, isNewChat }) {
  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        currentUser={userData}
        isNewChat={isNewChat}
      />
      <MessageInput onSend={onSend} isNewChat={isNewChat} />
    </div>
  );
}

export default ChatWindow;
