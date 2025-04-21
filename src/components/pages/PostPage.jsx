import { useContext, useEffect, useState } from "react"
import { Post } from "../Post"
import { useNavigate, useParams } from "react-router";
import { Comments } from "../Comments";
import { CommentForm } from "../CommentForm";
import UserContext from "../../context/UserContext";
import { EditPostForm } from "../EditPostForm";
import { Errors } from "../Errors";

export const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const { errors, setErrors, user, posts, setPosts } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/posts/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setPost(data.post);
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error"]);
            }
        };

        getPost();
    }, [comments, isEditing, posts]);

    useEffect(() => {
        const getPostComments = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/comments/posts/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setComments(data.comments);
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error"]);
            };
        };

        getPostComments();
    }, []);

    const handleUpdatePost = async () => {
        setIsEditing(true);
    };

    const handleDeletePost = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/posts/${post.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: post.content,
                    isDeleted: true
                })
            });
            const data = await response.json();

            if (response.ok) {
                navigate("/");
                setPosts(prevPosts => prevPosts.filter(post => post.id !== post.id));
            } else {
                setErrors([data.message]);
            }
        } catch (err) {
            setErrors(["Internal server error"]);
        }
    };

  return (
    <div className="post-page">
        {errors.length > 0 && <Errors errors={errors} />}

        {isEditing && (
            <EditPostForm postInfo={post} setPosts={setPosts} setIsEditing={setIsEditing} />
        )}

        {post && post.userId === user.id && !isEditing && (
            <div className="post-actions">
                <button className="edit-post-button" onClick={handleUpdatePost}>Edit</button>
                <button className="delete-post-button" onClick={handleDeletePost}>Delete</button>
            </div>
        )}

        {post && !isEditing && (
            <div>
                <Post postInfo={post} setPosts={setPosts} isEditing={isEditing} />

                <h2 id="comments">Comments</h2>
                
                <CommentForm postId={post.id} setComments={setComments} setPost={setPost} />

                {comments && comments.length > 0 ? <Comments comments={comments} postAuthorId={post.userId} setComments={setComments} postId={post.id} setPost={setPost} /> : (
                    <div className="empty-comment-container">
                        <h2>There are no comments.</h2>
                    </div>
                ) }
            </div>
        )}
    </div>
  )
}