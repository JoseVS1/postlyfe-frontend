import { useContext, useEffect, useState } from "react"
import { Post } from "./Post";
import { UserCard } from "./UserCard";
import UserContext from "../context/UserContext";

export const Profile = ({ profileUser, loggedUser, setIsEditing }) => {
  const [posts, setPosts] = useState(null);
  const { setErrors } = useContext(UserContext);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users/${profileUser.id}/posts`);
        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts);
        } else {
          setErrors([data.message]);
        };
      } catch (err) {
        setErrors(["Internal server error."]);
      };
    };

    getUserPosts();
  }, [profileUser.id]);
  return (
        <>
            {loggedUser.id === profileUser.id && <button onClick={() => setIsEditing(true)}>Edit Profile</button>}

            {loggedUser.id !== profileUser.id ? (
              <>
                <UserCard user={profileUser} />
              </>
            ) : (
              <>
                <img src={`${profileUser.profile.profilePictureUrl ? profileUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${profileUser.username}'s profile picture`} />
                <h1>{profileUser.username}</h1>
              </>
            )}

            <h2>Gender: {profileUser.profile.gender ? profileUser.profile.gender : "Not provided"}</h2>
            <h2>Bio:</h2>
            <p>{profileUser.profile.bio ? profileUser.profile.bio : "None"}</p>
            <h2>Created at: {profileUser.createdAt}</h2>
            <h2>First name: {profileUser.profile.firstName ? profileUser.profile.firstName : "Not provided"}</h2>
            <h2>Last name: {profileUser.profile.lastName ? profileUser.profile.lastName : "Not provided"}</h2>
            <h2>Birthdate: {profileUser.profile.birthDate ? profileUser.profile.birthDate : "Not provided"}</h2>
            <h2>Posts: </h2>

            {posts && posts.length > 0 ? (
                <div>
                  <ul>
                    {posts.map(post => ( 
                        <Post key={post.id} postInfo={post} setPosts={setPosts} />
                    ))}
                  </ul>
                </div>
              ) : (
                <h2>The user has no posts.</h2>
              )}
        </>
  )
}
