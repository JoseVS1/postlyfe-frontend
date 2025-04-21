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
        <div className="profile">
            {loggedUser.id !== profileUser.id ? (
              <>
                <UserCard user={profileUser} />
              </>
            ) : (
              <div className="user-card own-card">
                <div>
                  <img className="profile-picture" src={`${profileUser.profile.profilePictureUrl ? profileUser.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${profileUser.username}'s profile picture`} />
                  <h1 className="username">{profileUser.username}</h1>
                </div>

                {loggedUser.id === profileUser.id && <button className="edit-profile-button" onClick={() => setIsEditing(true)}>Edit Profile</button>}        
              </div>
            )}
            
            <div className="user-info">
              <h2><span className="bold">Gender:</span> {profileUser.profile.gender ? profileUser.profile.gender : "Not provided"}</h2>
            
              <div className="bio-container">
                <h2 className="bold">Bio:</h2>
                <p>{profileUser.profile.bio ? profileUser.profile.bio : "None"}</p>
              </div>
            
              <h2><span className="bold">Created at:</span> {profileUser.createdAt}</h2>
              <h2><span className="bold">First name:</span> {profileUser.profile.firstName ? profileUser.profile.firstName : "Not provided"}</h2>
              <h2><span className="bold">Last name:</span> {profileUser.profile.lastName ? profileUser.profile.lastName : "Not provided"}</h2>
              <h2><span className="bold">Birthdate:</span> {profileUser.profile.birthDate ? profileUser.profile.birthDate : "Not provided"}</h2>
            </div>

            <div className="user-posts">
              <h2>Posts</h2>

              {posts && posts.length > 0 ? (
                  <div>
                    <ul className="post-list">
                      {posts.map(post => ( 
                          <Post key={post.id} postInfo={post} setPosts={setPosts} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="empty-posts-container">
                    <h2>The user has no posts.</h2>
                  </div>
                )}
              </div>          
            </div>
  )
}