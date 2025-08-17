import { useState, useEffect, useRef } from "react";
import { getDirectChatMessages } from "~/lib/db.server";
import { io, Socket } from "socket.io-client";
import { useToast } from "~/components/ui/ToastContext";
import { useUnreadMessages } from "~/components/ui/UnreadMessagesContext";

interface ChatProps {
  friendId: string;
  friendName?: string | null;
  currentId: string;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}

const Chat = ({ friendId, friendName, currentId, onClose }: ChatProps) => {
  const [isLoading, setIsLoading] = useState(false);
  //message from db
  const [message, setMessage] = useState<Message[]>([]);
  //message to update db like putting in messages
  const [saveMessages, setSaveMessages] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const [friendIsTyping, setFriendIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { markAsRead, incrementUnreadCount } = useUnreadMessages();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const messages = await getDirectChatMessages(currentId, friendId);
        setMessage(messages);

        // Mark messages as read when opening chat
        markAsRead(friendId);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [friendId, currentId, markAsRead]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    // Register the user with the socket server
    socket.emit("register", {
      userId: currentId,
      username: "User", // Ideally this would come from props
    });

    // Listen for direct messages
    socket.on("directMessage", (msg: Message) => {
      // Check if the message is relevant to this chat
      if (
        (msg.senderId === currentId && msg.receiverId === friendId) ||
        (msg.senderId === friendId && msg.receiverId === currentId)
      ) {
        setMessage((prev) => [...prev, msg]);

        // Show toast notification for new messages from friend
        if (msg.senderId === friendId) {
          addToast(`New message from ${friendName || "friend"}`, "info");
        }
      } else if (msg.senderId !== currentId) {
        // If message is from someone else and we're not in that chat
        incrementUnreadCount(msg.senderId);
      }
    });

    // Listen for errors
    socket.on("error", (error) => {
      addToast(error.message || "Error with message", "error");
    });

    // Listen for typing indicators
    socket.on("userTyping", ({ userId, isTyping }) => {
      if (userId === friendId) {
        setFriendIsTyping(isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentId, friendId, addToast, friendName, incrementUnreadCount]);

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSaveMessages(value);

    if (!socket) return;

    // Only send typing event if this is a new typing session or continuing to type
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      socket.emit("typing", { receiverId: friendId, isTyping: true });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { receiverId: friendId, isTyping: false });
    }, 2000);
  };

  const handelSaveMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!saveMessages.trim()) return;

    if (!socket) {
      addToast("Connection issue. Please refresh.", "error");
      return;
    }

    // Clear typing indicator
    setIsTyping(false);
    socket.emit("typing", { receiverId: friendId, isTyping: false });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      socket.emit("sendDirectMessage", {
        text: saveMessages,
        receiverId: friendId,
      });

      // We'll assume success immediately for better UX
      // The socket error event will catch failures
      setSaveMessages("");
    } catch (error) {
      addToast("Failed to send message. Please try again.", "error");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-sky-800 p-3 flex justify-between items-center">
        <h2 className="text-white font-semibold">
          {friendName ? `Chat with ${friendName}` : "Chat"}
        </h2>
        <button
          onClick={onClose}
          className="bg-sky-700 hover:bg-sky-600 text-white px-3 py-1 rounded"
        >
          Back to Feed
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : message.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">
              No messages yet. Start the conversation!
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {message.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === currentId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.senderId === currentId
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="break-words">{msg.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.senderId === currentId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {friendIsTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-full">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={handelSaveMessage} className="flex gap-2">
          <input
            type="text"
            name="chat-input"
            id="chat-input"
            placeholder="Type a message..."
            value={saveMessages}
            onChange={handleTyping}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!saveMessages.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
