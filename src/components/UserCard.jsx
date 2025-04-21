import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import UserContext from "../context/UserContext";

export const UserCard = ({ user, acceptedUsersIds }) => {
  const [followStatus, setFollowStatus] = useState(null);
  const { setErrors, user: loggedUser } = useContext(UserContext);
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const getFollowStatus = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/follows/${user.id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setFollowStatus(data.followStatus);
        } else {
          setErrors([data.message]);
        }
      } catch {
        setErrors(["Internal server error."]);
      }
    };
    getFollowStatus();
  }, [user.id, baseUrl, setErrors]);

  const status = followStatus?.status;
  const isIncoming =
    status === "pending" && followStatus.followerId !== loggedUser.id;
  const isOutgoing =
    status === "pending" && followStatus.followerId === loggedUser.id;
  const isFriend =
    status === "accepted" || acceptedUsersIds?.includes(user.id);

  const handleFollow = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/follows`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();

      if (res.ok) {
        setFollowStatus(data.followStatus);
      } else {
        setErrors([data.message]);
      }
    } catch {
      setErrors(["Internal server error."]);
    }
  };

  const handleUpdateFollow = async (newStatus) => {
    try {
      const res = await fetch(`${baseUrl}/api/follows/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok) {
        setFollowStatus(data.followStatus);
      } else {
        setErrors([data.message]);
      }
    } catch {
      setErrors(["Internal server error."]);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/users/${user.id}`}>
        <img
          className="profile-picture"
          src={
            user.profile.profilePictureUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }
          alt={`${user.username}'s profile`}
        />
        <h2 className="username">{user.username}</h2>
      </Link>

      {isIncoming ? (
        <div className="request-actions">
          <button className="accept-button" onClick={() => handleUpdateFollow("accepted")}>
            Accept
          </button>
          <button className="reject-button" onClick={() => handleUpdateFollow("rejected")}>
            Reject
          </button>
        </div>
      ) : isOutgoing ? (
        <h2 className="pending">Pending</h2>
      ) : isFriend ? (
        <>
          <h2 className="friend-h2">Friend</h2>
          <button className="unfollow-button" onClick={() => handleUpdateFollow("rejected")}>
            Unfollow
          </button>
        </>
      ) : (
        <button
          className="follow-button"
          onClick={handleFollow}
        >
          Follow
        </button>
      )}
    </div>
  );
};