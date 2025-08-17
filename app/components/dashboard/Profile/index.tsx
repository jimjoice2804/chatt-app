import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/dashboard";
import PendingRequests from "./PendingRequests";

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-bold mb-4">My Profile</h2>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
            {(user.name || user.username).charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">
              {user.name || user.username}
            </h3>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Account Information</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Username:</span> {user.username}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            {user.name && (
              <div>
                <span className="font-medium">Display Name:</span> {user.name}
              </div>
            )}
            <div>
              <span className="font-medium">Member Since:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>

      <PendingRequests />
    </div>
  );
};

export default Profile;
