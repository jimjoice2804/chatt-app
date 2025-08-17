import { useState, useEffect } from "react";
import SearchBar from "~/components/ui/SearchBar";
import Badge from "~/components/ui/Badge";
import { useUnreadMessages } from "~/components/ui/UnreadMessagesContext";

type Friend = {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
};

interface FriendListProps {
  friends: Friend[];
  onSelectFriend?: (friendId: string, friendName: string) => void;
}

const FriendList = ({ friends, onSelectFriend }: FriendListProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);
  const { unreadMessages, markAsRead } = useUnreadMessages();

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  const handleSearch = (term: string) => {
    const filtered = friends.filter(
      (friend) =>
        (friend.name?.toLowerCase() || "").includes(term.toLowerCase()) ||
        friend.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);
    if (onSelectFriend) {
      const friend = friends.find((f) => f.id === friendId);
      const friendName = friend?.name || friend?.username || "";
      onSelectFriend(friendId, friendName);

      // Mark messages as read when selecting a friend
      markAsRead(friendId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-lg font-semibold mb-4">
        Friends ({friends.length})
      </h2>

      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Search friends..." />
      </div>

      {friends.length === 0 ? (
        <div className="text-gray-300 text-center py-4">
          You do not have friends yet
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-gray-300 text-center py-4">
          No friends match your search
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => handleSelectFriend(friend.id)}
              className={`p-3 rounded cursor-pointer transition-colors w-full flex items-center justify-between ${
                selectedFriendId === friend.id
                  ? "bg-sky-700"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white mr-2">
                  {(friend.name || friend.username).charAt(0).toUpperCase()}
                </div>
                <span className="text-white">
                  {friend.name || friend.username}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {unreadMessages[friend.id] > 0 && (
                  <Badge count={unreadMessages[friend.id]} />
                )}
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                  <span className="text-xs text-green-300">Online</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
