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
      <div className="bg-white p-4 rounded-lg shadow mt-4">
        <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
        <p className="text-gray-500">No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Friend Requests ({pendingRequests.length})
      </h3>

      <div className="space-y-3">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="border border-gray-200 p-3 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                  {(request.sender.name || request.sender.username)
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="font-medium">
                    {request.sender.name || request.sender.username}
                  </div>
                  <div className="text-sm text-gray-500">
                    @{request.sender.username}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptRequest(request.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1 rounded text-sm ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {isSubmitting ? "..." : "Accept"}
                </button>
                <button
                  onClick={() => handleRejectRequest(request.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1 rounded text-sm ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white`}
                >
                  {isSubmitting ? "..." : "Reject"}
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
