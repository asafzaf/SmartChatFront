import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ messages, onSend, userData, isNewChat, waitingForResponse }) {
  return (
    <div className="chat-window">
      <MessageList
        messages={messages}
        currentUser={userData}
        isNewChat={isNewChat}
      />
      <MessageInput onSend={onSend} isNewChat={isNewChat} waitingForResponse={waitingForResponse} />
    </div>
  );
}

export default ChatWindow;
