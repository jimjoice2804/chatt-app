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
} from "~/lib/db.server";
import FriendList from "~/components/dashboard/FriendsList/FriendList";
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

  return {
    friends,
    user: userData,
    allFeed,
    newFriends,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formName = formData.get("formName");
  try {
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

      return (
        redirect("/dashboard"),
        {
          success: true,
        }
      );
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
            list of users, to whom im gonna send friend request to
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
        <div className="bg-sky-500">My Profile section</div>
      </div>
    </div>
  );
};

export default Dashboard;
