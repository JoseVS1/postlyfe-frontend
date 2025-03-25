import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import UserContext from "../context/UserContext";

export const UserCard = ({ user, acceptedUsersIds, pending }) => {
    const [followStatus, setFollowStatus] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const { setErrors } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const getFollowStatus = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/follows/${user.id}`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    setFollowStatus(data.followStatus);

                    if (data.followStatus.status === "rejected") {
                        setIsRejected(false);
                    }
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getFollowStatus();
    }, []);

    if (pending) {
        return (
            <div>
                <Link to={`/users/${user.id}`}>
                    <img src={`${user.profile.profilePictureUrl ? user.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${user.username}'s profile picture`} />
                    <h2>{user.username}</h2>
                </Link>

                <h2>Pending</h2>
            </div>
        )
    };

    const handleFollow = async id => {
        try {
            const response = await fetch(`${baseUrl}/api/follows`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id 
                })
            });
            const data = await response.json();

            if (response.ok) {
                setIsFollowing(true);
            } else if (response.status === 400) {
                handleUpdateFollow("pending");
                setIsFollowing(true);
                setErrors([data.message]);
            } else {
                setErrors([data.message]);
            }
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    };

    const handleUpdateFollow = async newStatus => {
        try {
            const response = await fetch(`${baseUrl}/api/follows/${user.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });
            const data = await response.json();

            if (response.ok) {
                if (data.followStatus.status === "accepted") {
                    setIsFriend(true);
                    setIsRejected(false);
                } else if (data.followStatus.status === "") {
                    setIsFriend(false);
                    setIsRejected(true);
                }
                setFollowStatus(data.followStatus);
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    };
  return (
    <div>
        <Link to={`/users/${user.id}`}>
            <img src={`${user.profile.profilePictureUrl ? user.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${user.username}'s profile picture`} />
            <h2>{user.username}</h2>
        </Link>

        {followStatus && followStatus.status === "pending" ? (
            <>
                <button onClick={() => handleUpdateFollow("accepted")}>Accept</button>
                <button onClick={() => handleUpdateFollow("")}>Reject</button>
            </>
        ) : isFollowing ? (
            <h2>Pending</h2>
        ) : acceptedUsersIds && acceptedUsersIds.includes(user.id) || isFriend && !isRejected || followStatus && followStatus.status === "accepted" && !isRejected ? (
            <>
                <h2>Friend</h2>
                <button onClick={() => handleUpdateFollow("")}>Unfriend</button>
            </>
        ) : (
            <button onClick={() => handleFollow(user.id)}>Follow</button>
        )}
    </div>
  )
}
