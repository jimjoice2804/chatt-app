import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/dashboard";

const Friends = () => {
  const { newFriends } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>
        <div>
          <h2>Add New Friends</h2>
          {newFriends.map((friend) => (
            <div key={friend.id}>
              <div>{friend.name || friend.username}</div>
              <button>Add Friend</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
