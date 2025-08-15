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
    <div>
      {isSubmitting ? (
        <div>Submitting.....</div>
      ) : (
        <div>
          <div>
            <Form action="/dashboard" method="post">
              <input type="hidden" name="formName" value="createPost" />
              <input
                type="text"
                name="content"
                onChange={(e) => setPost(e.target.value)}
                value={post}
                placeholder="Whats in your mind?"
              />
              <button type="submit" disabled={!post.trim() || isSubmitting}>
                Post
              </button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
