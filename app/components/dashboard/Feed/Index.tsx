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
    <div className="p-4">
      <div className="mb-4">
        <CreatePost />
      </div>

      <div>
        {allFeed.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No posts to display yet
          </div>
        ) : (
          <div className="space-y-4">
            {allFeed.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <div className="font-medium text-gray-800">
                    {post.author.name || post.author.username}
                  </div>
                  <div className="text-xs text-gray-400 ml-2">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-gray-700">{post.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
