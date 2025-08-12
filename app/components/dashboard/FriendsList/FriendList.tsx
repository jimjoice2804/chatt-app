import { useState } from "react";

type Friend = {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
};

interface FriendListProps {
  friends: Friend[];
  onSelectFriend?: (friendId: string) => void;
}

const FriendList = ({ friends, onSelectFriend }: FriendListProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleSelectFriend = (friendId: string) => {
    setSelectedFriendId(friendId);
    if (onSelectFriend) {
      onSelectFriend(friendId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-lg font-semibold mb-4">
        Friends ({friends.length})
      </h2>

      {friends.length === 0 ? (
        <div className="text-gray-300 text-center py-4">
          You do not have friends yet
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => handleSelectFriend(friend.id)}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedFriendId === friend.id
                  ? "bg-sky-700"
                  : "bg-slate-600 hover:bg-slate-700"
              }`}
            >
              <span className="text-white">
                {friend.name || friend.username}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
