import { useContext, useEffect, useState } from "react"
import UserContext from "../context/UserContext";
import { Link } from "react-router";
import { Comments } from "./Comments";

export const Comment = ({ comment, postAuthorId, setComments, postId, setPost }) => {
    const [commentUser, setCommentUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        text: comment.text
    });
    const [replyFormData, setReplyFormData] = useState({
        text: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const { setErrors, user } = useContext(UserContext);
    const [isReplying, setIsReplying] = useState(false);
    const [replies, setReplies] = useState(null);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const getCommentUser = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/users/${comment.userId}`);
                const data = await response.json();

                if (response.ok) {
                    setCommentUser(data.user);
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getCommentUser();
    }, []);

    useEffect(() => {
        const getReplies = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/comments/${comment.id}`);
                const data = await response.json();

                if (response.ok) {
                    setReplies(data.replies);
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getReplies();
    }, []);

    const handleEditSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/comments/${comment.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: editFormData.text
                })
            });

            const data = await response.json();

            if (response.ok) {
                setComments(prevComments => prevComments.map(c => c.id === comment.id ? data.comment : c));
                setIsEditing(false);
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    }

    const handleUpdateComment = () => {
        setIsEditing(true);
    };

    const handleDeleteComment = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/comments/${comment.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setComments(prevComments => prevComments.filter(c => c.id !== comment.id));
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    };

    const handleReply = () => {
        setIsReplying(true);
    };

    const handleReplySubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/comments`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: replyFormData.text,
                    userId: user.id,
                    postId,
                    parentCommentId: comment.id
                })
            });
            const data = await response.json();

            if (response.ok) {
                setPost(data.post);
                setIsReplying(false);
                setReplyFormData({ text: "" });
                setReplies(prevReplies => [...prevReplies, data.comment]);
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        };
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData({ text: comment.text });
    };

    const handleCancelReply = () => {
        setIsReplying(false);
        setReplyFormData({ text: "" });
    };
  return (
    <>
        {commentUser && (
            <div>
                <div>
                    <Link to={`/users/${commentUser.id}`}>
                        <img src={`${commentUser.profile.profilePictureUrl ? commentUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${commentUser.username}'s profile picture`} />
                        <h2>{commentUser.username}</h2>
                    </Link>

                    {commentUser.id === postAuthorId && <h3> • Author</h3>}

                    <h3>{comment.createdAt}</h3>

                    {isEditing ? (
                        <>
                            <form onSubmit={handleEditSubmit}>
                                <textarea onChange={e => setEditFormData({ text: e.target.value})} value={editFormData.text} name="text" id="text" required></textarea>
                                <button type="submit">Edit</button>
                            </form>

                            <button onClick={handleCancelEdit}>Cancel</button>
                        </>
                    ) : (
                        <p>{comment.parentCommentId && <span>Replying to {commentUser.username}: </span>} {comment.text}</p>
                    )}

                    {user.id === commentUser.id && !isEditing && (
                        <div>
                            <button onClick={handleUpdateComment}>Update</button>
                            <button onClick={handleDeleteComment}>Delete</button>
                        </div>
                    )}

                    <button onClick={handleReply}>Reply</button>
                </div>
                
                {isReplying && (
                    <>
                        <form onSubmit={handleReplySubmit}>
                            <textarea onChange={e => setReplyFormData({ text: e.target.value})} value={replyFormData.text} name="text" id="text" required></textarea>
                            <button type="submit">Submit</button>
                        </form>

                        <button onClick={handleCancelReply}>Cancel</button>
                    </>
                )}

                {replies && replies.length > 0 && <Comments comments={replies} postAuthorId={postAuthorId} setComments={setComments} postId={postId} setPost={setPost} />}
            </div>
        )}
    </>
  )
}
