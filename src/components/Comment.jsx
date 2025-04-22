import { useContext, useEffect, useState } from "react"
import UserContext from "../context/UserContext";
import { Link } from "react-router";
import { Comments } from "./Comments";
import { parseISO, format } from "date-fns"

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
    const [formattedCreatedAt, setFormattedCreatedAt] = useState(format(parseISO(comment.createdAt), "MMMM do, yyyy"));
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
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getReplies();
    }, [replies]);

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
            }
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
            }
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
                setIsReplying(false);
                setReplyFormData({ text: "" });
                if (setPost) {
                    setPost(data.post);
                }
                setReplies(prevReplies => [...prevReplies, data.comment]);
            } else {
                setErrors([data.message]);
            }
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
                <div className="comment">
                    <Link className="user-link" to={`/users/${commentUser.id}`}>
                        <img className="profile-picture" src={`${commentUser.profile.profilePictureUrl ? commentUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${commentUser.username}'s profile picture`} />
                        
                        <div>
                            <div className="username-status-container">
                                <h2 className="username" >{commentUser.username}</h2>
                                {commentUser.id === postAuthorId && <h3 className="author"> • Author</h3>}
                            </div>

                            <h3 className="timestamp">{formattedCreatedAt}</h3>
                        </div>
                    </Link>

                    {isEditing ? (
                        <form className="edit-comment-form" onSubmit={handleEditSubmit}>
                            <textarea onChange={e => setEditFormData({ text: e.target.value})} value={editFormData.text} name="text" id="text" required></textarea>
                            
                            <div>
                                <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                                <button className="edit-comment-button" type="submit">Edit</button>
                            </div>
                        </form>
                    ) : (
                        <p>{comment.parentCommentId && <span className="reply">Replying to {commentUser.username}: </span>} {comment.text}</p>
                    )}

                    <div className="comment-actions">
                        {user.id === commentUser.id && !isEditing && (
                            <>
                                <button className="edit-comment-button" onClick={handleUpdateComment}>Update</button>
                                <button className="delete-comment-button" onClick={handleDeleteComment}>Delete</button>
                            </>
                        )}

                        <button className="reply-button" onClick={handleReply}>Reply</button>
                    </div>
                </div>
                
                {isReplying && (
                    <div className="reply-form-container">
                        <form className="create-reply-form" onSubmit={handleReplySubmit}>
                            <textarea onChange={e => setReplyFormData({ text: e.target.value})} value={replyFormData.text} name="text" id="text" required></textarea>
                            
                            <div>
                                <button className="cancel-button" onClick={handleCancelReply}>Cancel</button>
                                <button className="submit-button" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                )}

                {replies && (
                    <div className="replies-section">
                        <Comments comments={replies} postAuthorId={postAuthorId} setComments={setComments} postId={postId} setPost={setPost} />
                    </div>
                )}
            </div>
        )}
    </>
  )
}