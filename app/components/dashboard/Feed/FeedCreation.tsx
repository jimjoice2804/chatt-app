import { useEffect, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";

const CreatePost = () => {
  const [post, setPost] = useState("");
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (navigation.state === "idle" && post.trim() !== "") {
      setPost("");
    }
  }, [post, navigation.state]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Share your thoughts
      </h3>

      {isSubmitting ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Posting...</span>
        </div>
      ) : (
        <Form action="/dashboard" method="post" className="space-y-4">
          <input type="hidden" name="formName" value="createPost" />

          <textarea
            name="content"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {post.length}/280 characters
            </div>
            <button
              type="submit"
              disabled={!post.trim() || isSubmitting || post.length > 280}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Post
            </button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default CreatePost;
