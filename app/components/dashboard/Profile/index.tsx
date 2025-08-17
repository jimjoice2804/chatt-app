import { useLoaderData } from "@remix-run/react";
import type { loader } from "~/routes/dashboard";
import PendingRequests from "./PendingRequests";

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-white text-2xl font-bold mb-6">My Profile</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {(user.name || user.username).charAt(0).toUpperCase()}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold">
                {user.name || user.username}
              </h3>
              <p className="text-blue-100 text-lg">@{user.username}</p>
              <p className="text-blue-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 block">
                Username
              </span>
              <span className="text-gray-800 font-medium">{user.username}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 block">
                Email
              </span>
              <span className="text-gray-800 font-medium">{user.email}</span>
            </div>
            {user.name && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-sm font-medium text-gray-500 block">
                  Display Name
                </span>
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 block">
                Member Since
              </span>
              <span className="text-gray-800 font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium">
              Edit Profile
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
              Settings
            </button>
            <a
              href="/logout"
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              Logout
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PendingRequests />
      </div>
    </div>
  );
};

export default Profile;
