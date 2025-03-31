import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend, userData }) {
  return (
    <div className="chat-window">
      <MessageList messages={messages} currentUser={userData} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatWindow;
