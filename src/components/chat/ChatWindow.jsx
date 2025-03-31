import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend }) {
  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default ChatWindow;
