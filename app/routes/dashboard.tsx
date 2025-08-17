import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs,
} from "@remix-run/node";
import { getUserId } from "~/lib/session.server";
import {
  getUserById,
  getUserFriends,
  createPost,
  getFeedPosts,
  getAllUsers,
  sendFriendRequest,
  getPendingFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "~/lib/db.server";
import FriendList from "~/components/dashboard/FriendsList/FriendList";
import NonFriendList from "~/components/dashboard/FriendsList/Non-FriendList";
import Profile from "~/components/dashboard/Profile";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Chat from "~/components/dashboard/ChatSection";
import Feed from "~/components/dashboard/Feed/Index";

export async function loader({ request }: LoaderFunctionArgs) {
  //getting userID from cookie
  const user = await getUserId(request);
  if (!user) {
    return redirect("/login");
  }
  // getting  user data: name, username, email etc
  const userData = await getUserById(user);
  if (!userData) throw new Error("No user Data");
  //fetching user friends
  const friends = await getUserFriends(user);
  //fetch feed
  const allFeed = await getFeedPosts();
  //fetch current user data
  const newFriends = await getAllUsers(user);
  //fetching all the people accept who can be the friends of user

  //fetch pending friend requests
  const pendingRequests = await getPendingFriendRequest(user);

  return {
    friends,
    user: userData,
    allFeed,
    newFriends,
    pendingRequests,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formName = formData.get("formName");
  try {
    //create post handler
    if (formName === "createPost") {
      const content = formData.get("content");

      if (!content || content.toString().trim() === "") {
        return {
          error: "Post content cannot be empty",
          status: 400,
        };
      }
      const userId = await getUserId(request);
      if (!userId) {
        return redirect("/login");
      }

      await createPost(userId, content.toString());

      return redirect("/dashboard");
    }

    //send friend request handler
    if (formName === "sendFriendRequest") {
      const friendId = formData.get("friendId");
      const senderId = formData.get("senderId");
      if (!friendId || !senderId) {
        return {
          error: "Missing friend or sender ID",
          status: 400,
        };
      }
      await sendFriendRequest(senderId.toString(), friendId.toString());

      return redirect("/dashboard");
    }

    //accept friend request handler
    if (formName === "acceptFriendRequest") {
      const friendshipId = formData.get("friendshipId");
      const currentUserId = await getUserId(request);

      if (!friendshipId || !currentUserId) {
        return {
          error: "Missing friendship ID or user not authenticated",
          status: 400,
        };
      }

      await acceptFriendRequest(currentUserId, friendshipId.toString());
      return redirect("/dashboard");
    }

    //reject friend request handler
    if (formName === "rejectFriendRequest") {
      const friendshipId = formData.get("friendshipId");
      const currentUserId = await getUserId(request);

      if (!friendshipId || !currentUserId) {
        return {
          error: "Missing friendship ID or user not authenticated",
          status: 400,
        };
      }

      await rejectFriendRequest(currentUserId, friendshipId.toString());
      return redirect("/dashboard");
    }
  } catch (error) {
    console.error("Action error:", error);
  }
}

const Dashboard = () => {
  const { friends, user, allFeed } = useLoaderData<typeof loader>();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  return (
    <div>
      <div className="grid grid-cols-4 min-h-screen">
        <div className="bg-sky-950 min-h-screen">
          <div className="bg-slate-500 min-h-[50%]">
            <FriendList
              friends={friends}
              onSelectFriend={setSelectedFriendId}
            />
          </div>
          <div className="bg-slate-100 min-h-[50%]">
            <NonFriendList />
          </div>
        </div>
        <div className="bg-sky-900 col-span-2">
          {selectedFriendId ? (
            <Chat
              friendId={selectedFriendId}
              currentId={user.id}
              onClose={() => setSelectedFriendId(null)}
            />
          ) : (
            <Feed allFeed={allFeed} />
          )}
        </div>
        <div className="bg-sky-500">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
