import CreatePost from "./FeedCreation";

interface FeedType {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: {
    id: string;
    name: string | null;
    username: string;
  };
}

interface FeedProps {
  allFeed: FeedType[];
}

const Feed = ({ allFeed }: FeedProps) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <CreatePost />
      </div>

      <div>
        {allFeed.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No posts yet</div>
            <div className="text-gray-400 text-sm">
              Be the first to share something!
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {allFeed.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {(post.author.name || post.author.username)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {post.author.name || post.author.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-800 leading-relaxed break-words">
                    {post.content}
                  </div>

                  {/* Engagement section - for future features */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-4 text-sm text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <span>💙</span>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <span>💬</span>
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                      <span>📤</span>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
