import { useState, useEffect, useRef } from "react";
import { getDirectChatMessages } from "~/lib/db.server";
import { io, Socket } from "socket.io-client";

interface ChatProps {
  friendId: string;
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

const Chat = ({ friendId, currentId, onClose }: ChatProps) => {
  const [isLoading, setIsLoading] = useState(false);
  //message from db
  const [message, setMessage] = useState<Message[]>([]);
  //message to update db like putting in messages
  const [saveMessages, setSaveMessages] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const messages = await getDirectChatMessages(currentId, friendId);
        setMessage(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [friendId, currentId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    socket.on("newMessage", (msg: Message) => {
      setMessage((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentId, friendId]);

  const handelSaveMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!saveMessages.trim()) return;

    if (!socket) return;
    socket.emit("sendMessage", {
      content: saveMessages,
      senderId: currentId,
      receiverId: friendId,
    });

    setSaveMessages("");
  };

  return (
    <div>
      <h2 className="text-white font-semibold">Chat</h2>
      <button
        onClick={onClose}
        className="bg-sky-700 hover:bg-sky-600 text-white px-3 py-1 rounded"
      >
        Back to Feed
      </button>
      {isLoading ? (
        <div>Loading Message.....</div>
      ) : (
        <div>
          {message.length == 0 ? (
            <div>No message to Display</div>
          ) : (
            <div>
              {message.map((message) => {
                return (
                  <div key={message.id}>
                    {message.senderId === currentId ? (
                      <div>You {message.content}</div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>
          )}
        </div>
      )}

      <div>
        <form onSubmit={handelSaveMessage}>
          <input
            type="text"
            name="chat-input"
            id="chat-input"
            placeholder="Type Message"
            value={saveMessages}
            onChange={(e) => setSaveMessages(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
