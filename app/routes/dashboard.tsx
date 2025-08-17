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
  const [selectedFriendName, setSelectedFriendName] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"feed" | "friends" | "profile">(
    "feed"
  );

  const handleSelectFriend = (friendId: string, friendName: string) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    setActiveTab("feed"); // Switch to main area to show chat
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex justify-around p-2">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 py-2 px-4 text-center rounded-lg ${
              activeTab === "feed" ? "bg-blue-500 text-white" : "text-gray-600"
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2 px-4 text-center rounded-lg ${
              activeTab === "friends"
                ? "bg-blue-500 text-white"
                : "text-gray-600"
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-4 text-center rounded-lg ${
              activeTab === "profile"
                ? "bg-blue-500 text-white"
                : "text-gray-600"
            }`}
          >
            Profile
          </button>
          <a
            href="/logout"
            className="flex-1 py-2 px-4 text-center rounded-lg text-red-600 hover:bg-red-50"
          >
            Logout
          </a>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 min-h-screen">
        {/* Left Sidebar - Friends */}
        <div className="col-span-3 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
          <div className="h-1/2 border-b border-slate-700">
            <FriendList friends={friends} onSelectFriend={handleSelectFriend} />
          </div>
          <div className="h-1/2 bg-slate-700">
            <NonFriendList />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-6 bg-gray-50">
          {selectedFriendId ? (
            <Chat
              friendId={selectedFriendId}
              friendName={selectedFriendName}
              currentId={user.id}
              onClose={() => {
                setSelectedFriendId(null);
                setSelectedFriendName(null);
              }}
            />
          ) : (
            <Feed allFeed={allFeed} />
          )}
        </div>

        {/* Right Sidebar - Profile */}
        <div className="col-span-3 bg-gradient-to-b from-slate-600 to-slate-700">
          <Profile />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {activeTab === "feed" && (
          <div className="min-h-screen">
            {selectedFriendId ? (
              <Chat
                friendId={selectedFriendId}
                friendName={selectedFriendName}
                currentId={user.id}
                onClose={() => {
                  setSelectedFriendId(null);
                  setSelectedFriendName(null);
                }}
              />
            ) : (
              <Feed allFeed={allFeed} />
            )}
          </div>
        )}

        {activeTab === "friends" && (
          <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900">
            <div className="p-4">
              <FriendList
                friends={friends}
                onSelectFriend={(friendId, friendName) => {
                  handleSelectFriend(friendId, friendName);
                  setActiveTab("feed");
                }}
              />
            </div>
            <div className="p-4 bg-slate-700">
              <NonFriendList />
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="min-h-screen bg-gradient-to-b from-slate-600 to-slate-700">
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
