import { useContext, useEffect } from "react"
import { Post } from "../Post";
import { PostForm } from "../PostForm";
import UserContext from "../../context/UserContext";
import { Errors } from "../Errors";

export const HomePage = () => {
  const { errors, setErrors, posts, setPosts } = useContext(UserContext);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/posts`);
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts);
        } else {
          setErrors([data.message]);
        }
      } catch (err) {
        setErrors(["Internal server error"]);
      }
    };

    getPosts();
  }, []);

  return (
    <div className="home-page">
      {errors.length > 0 && <Errors errors={errors} />}

      <h1>Postlyfe</h1>

      <PostForm setPosts={setPosts} />

      {posts ? (
        <div>
          <ul className="post-list">
            {posts.map(post => ( 
                <Post key={post.id} postInfo={post} setPosts={setPosts} />
            ))}
          </ul>
        </div>
      ) : (
        <h1>There are no posts.</h1>
      )}
    </div>
  )
}