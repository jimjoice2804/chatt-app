import { useState } from "react";

interface ChatProps {
  friendId: string;
  currentId: string;
  onClose: () => void;
}
const Chat = ({ friendId, currentId, onClose }: ChatProps) => {
  return (
    <div>
      <div>Chat</div>
    </div>
  );
};

export default Chat;
