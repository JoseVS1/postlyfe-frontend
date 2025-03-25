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
    }, [postUser]);

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
    <>
        {postUser && !isEditing && (
            <div>
                <Link to={`/users/${postUser.id}`}>
                    <img src={`${postUser.profile.profilePictureUrl ? postUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${postUser.username}'s profile picture`} />
                    <h2>{postUser.username}</h2>
                </Link>

                {followStatus && followStatus.status === "accepted" && <h3> • Friend</h3> }
    
                <h3>{postInfo.updatedAt ? `Updated at: ${[postInfo.updatedAt]}` : `Created at: ${postInfo.createdAt}`}</h3>

                <Link to={`/posts/${postInfo.id}`}>
                    <div>
                        <p>{postInfo.content}</p>
                    </div>
                </Link>

                <h2><button onClick={handleLike}>{liked ? "Unlike" : "Like"}</button> {postInfo.likeCount}</h2>
                <h2>Comments: {postInfo.commentCount}</h2>
            </div>
        )}
    </>
  )
}
