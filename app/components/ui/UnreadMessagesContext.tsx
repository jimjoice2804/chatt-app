import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UnreadMessagesContextType {
  unreadMessages: Record<string, number>;
  markAsRead: (friendId: string) => void;
  incrementUnreadCount: (friendId: string) => void;
}

const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error(
      "useUnreadMessages must be used within an UnreadMessagesProvider"
    );
  }
  return context;
};

export const UnreadMessagesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>(
    {}
  );

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem("unreadMessages");
      if (stored) {
        setUnreadMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load unread messages from localStorage:", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages));
    } catch (e) {
      console.error("Failed to save unread messages to localStorage:", e);
    }
  }, [unreadMessages]);

  const markAsRead = (friendId: string) => {
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[friendId];
      return updated;
    });
  };

  const incrementUnreadCount = (friendId: string) => {
    setUnreadMessages((prev) => ({
      ...prev,
      [friendId]: (prev[friendId] || 0) + 1,
    }));
  };

  return (
    <UnreadMessagesContext.Provider
      value={{ unreadMessages, markAsRead, incrementUnreadCount }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};
