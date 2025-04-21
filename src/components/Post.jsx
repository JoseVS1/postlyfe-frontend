import { useContext, useEffect, useState } from "react"
import { Link } from "react-router";
import UserContext from "../context/UserContext";

export const Post = ({ postInfo, setPosts, isEditing }) => {
    const [postUser, setPostUser] = useState(null);
    const [liked, setLiked] = useState(false);
    const [followStatus, setFollowStatus] = useState(null);
    const { setErrors } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    
    useEffect(() => {
        const getPostUser = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/users/${postInfo.userId}`);
                const data = await response.json();

                if (response.ok) {
                    setPostUser(data.user);
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            }
        };
        
        getPostUser();
    }, []);

    useEffect(() => {
        const getFollowStatus = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/follows/${postUser.id}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    setFollowStatus(data.followStatus);
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        if (postUser) {
            getFollowStatus();
        }
    }, [postUser, followStatus]);

    useEffect(() => {
        const getHasLiked = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/likes/${postInfo.id}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    if (data.liked) {
                        setLiked(true);
                    }
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            }
        };
        
        getHasLiked();
    }, []);

    const handleLike = async () => {
        if (!liked) {
            try {
                const response = await fetch(`${baseUrl}/api/likes`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        postId: postInfo.id
                    })
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setPosts(prevPosts => prevPosts.map(p => p.id === postInfo.id ? data.post : p));
                    setLiked(true);
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            }
        } else {
            try {
                const response = await fetch(`${baseUrl}/api/likes/${postInfo.id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    setPosts(prevPosts => prevPosts.map(p => p.id === postInfo.id ? data.post : p));
                    setLiked(false);
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };
    };
    
  return (
    <div className="post">
        {postUser && !isEditing && (
            <div>
                <Link className="user-link" to={`/users/${postUser.id}`}>
                    <img className="profile-picture" src={`${postUser.profile.profilePictureUrl ? postUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${postUser.username}'s profile picture`} />
                    
                    <div>
                        <div className="username-status-container">
                            <h2 className="username">{postUser.username}</h2>
                            {followStatus && followStatus.status === "accepted" && <h3> • <span className="friend-h2">Friend</span></h3> }
                        </div>
                    
                        <h3 className="timestamp">{postInfo.updatedAt !== postInfo.createdAt ? `Updated at: ${[postInfo.updatedAt]}` : `Created at: ${postInfo.createdAt}`}</h3>
                    </div>
                </Link>                        
                
                
                <Link to={`/posts/${postInfo.id}`}>
                    <div className="content-container">
                        <p>{postInfo.content}</p>
                    </div>
                </Link>

                <div>
                    <h2><span className="like" onClick={handleLike}>{liked ? <i className="liked fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}</span> <span>{postInfo.likeCount}</span></h2>
                    <h2><Link to={`/posts/${postInfo.id}#comments`}><i className="comment-icon fa-regular fa-comment"></i> <span>{postInfo.commentCount}</span></Link></h2>
                </div>
            </div>
        )}
    </div>
  )
}
