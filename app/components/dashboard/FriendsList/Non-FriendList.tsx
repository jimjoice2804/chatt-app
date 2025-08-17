import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { loader } from "~/routes/dashboard";
import SearchBar from "~/components/ui/SearchBar";

const NonFriendList = () => {
  const { newFriends, user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  const [filteredFriends, setFilteredFriends] = useState(newFriends);

  useEffect(() => {
    setFilteredFriends(newFriends);
  }, [newFriends]);

  const handleSearch = (term: string) => {
    const filtered = newFriends.filter(
      (friend) =>
        (friend.name?.toLowerCase() || "").includes(term.toLowerCase()) ||
        friend.username.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  const handleAddFriend = (friendId: string) => {
    fetcher.submit(
      {
        formName: "sendFriendRequest",
        friendId: friendId,
        senderId: user.id,
      },
      {
        method: "post",
        action: "/dashboard",
      }
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-lg font-semibold mb-4">
        Add New Friends ({newFriends.length})
      </h2>

      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Find users..." />
      </div>

      {newFriends.length === 0 ? (
        <div className="text-gray-300 text-center py-4">
          No new users to add as friends
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-gray-300 text-center py-4">
          No users match your search
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-gray-700 p-3 rounded flex items-center justify-between"
            >
              <div>
                <div className="text-white font-medium">
                  {friend.name || friend.username}
                </div>
                {friend.name && (
                  <div className="text-gray-300 text-sm">
                    @{friend.username}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAddFriend(friend.id)}
                disabled={isSubmitting}
                className={`px-3 py-1 rounded text-sm ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isSubmitting ? "Sending..." : "Add Friend"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NonFriendList;
