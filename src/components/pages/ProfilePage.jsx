import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router"
import { EditProfileForm } from "../EditProfileForm";
import UserContext from "../../context/UserContext";
import { Profile } from "../Profile";
import { Errors } from "../Errors";

export const ProfilePage = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const { errors, setErrors, user } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [isLoggedUser, setIsLoggedUser] = useState(false);

    useEffect(() => {
        const getProfileUser = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/users/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setProfileUser(data.user);

                    if (data.user.id === user.id) {
                        setIsLoggedUser(true);
                    };
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error"]);
            }
        };

        getProfileUser();
    }, [id, isEditing]);

  return (
    <div className="profile-page">
        {errors.length > 0 && <Errors errors={errors} />}
        
        {profileUser && !isLoggedUser || profileUser && !isEditing ? (
            <Profile profileUser={profileUser} loggedUser={user} setIsEditing={setIsEditing} />
        ) : (
            <EditProfileForm profileUser={profileUser} setIsEditing={setIsEditing} />
        )}
    </div>
  )
}