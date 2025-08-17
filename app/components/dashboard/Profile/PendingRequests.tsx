import { useLoaderData, useFetcher } from "@remix-run/react";
import type { loader } from "~/routes/dashboard";

const PendingRequests = () => {
  const { pendingRequests } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const handleAcceptRequest = (friendshipId: string) => {
    fetcher.submit(
      {
        formName: "acceptFriendRequest",
        friendshipId: friendshipId,
      },
      {
        method: "post",
        action: "/dashboard",
      }
    );
  };

  const handleRejectRequest = (friendshipId: string) => {
    fetcher.submit(
      {
        formName: "rejectFriendRequest",
        friendshipId: friendshipId,
      },
      {
        method: "post",
        action: "/dashboard",
      }
    );
  };

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Friend Requests
        </h3>
        <div className="text-center py-4">
          <div className="text-gray-500 mb-1">No pending friend requests</div>
          <div className="text-sm text-gray-400">
            You&apos;re all caught up!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Friend Requests ({pendingRequests.length})
      </h3>

      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(request.sender.name || request.sender.username)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">
                    {request.sender.name || request.sender.username}
                  </div>
                  <div className="text-sm text-gray-500">
                    @{request.sender.username}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Wants to be your friend
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Accept"}
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Decline"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
