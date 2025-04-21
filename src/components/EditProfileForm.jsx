import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { Errors } from "./Errors";

export const EditProfileForm = ({ setIsEditing }) => {
    const { errors, setErrors, user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: user.profile && user.profile.firstName ? user.profile.firstName : "",
        lastName: user.profile?.lastName ? user.profile.lastName : "",
        birthDate: user.profile?.birthDate ? user.profile.birthDate : "",
        gender: user.profile?.gender ? user.profile.gender : "",
        bio: user.profile?.bio ? user.profile.bio : "",
        profilePictureUrl: user.profile?.profilePictureUrl ? user.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    });
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            const response = await fetch(`${baseUrl}/api/profiles/${user.profile.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: formData.firstName ? formData.firstName : null,
                    lastName: formData.lastName ? formData.lastName : null,
                    birthDate: formData.birthDate ? formData.birthDate : null,
                    gender: formData.gender ? formData.gender : null,
                    bio: formData.bio ? formData.bio : null,
                    profilePictureUrl: formData.profilePictureUrl
                })
            });
            const data = await response.json();
            console.log(data)

            if (response.ok) {
                setUser(data.user);
                setIsEditing(false);
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    };

    const handleInputChange = e => {
        setFormData(prevFormData => (
            {
                ...prevFormData,
                [e.target.name]: e.target.value
            }
        ));
    };

    const handleCancelUpdate = () => {
        setFormData(formData);
        setIsEditing(false);
    };

  return (
    <div className="edit-profile-container">
        <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="profilePictureUrl">Profile Picture URL: </label>
                <img className="profile-picture" src={`${user.profile?.profilePictureUrl ? user.profile.profilePictureUrl : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}`} alt={`${user.username}'s profile picture`} />
                <input type="text" onChange={handleInputChange} value={formData.profilePictureUrl} name="profilePictureUrl" id="profilePictureUrl" />
            </div>
            
            <div>
                <label htmlFor="gender">Gender: </label>
                <input type="text" onChange={handleInputChange} value={formData.gender} name="gender" id="gender" />
            </div>
            
            <div>
                <label htmlFor="bio">Bio: </label>
                <textarea onChange={handleInputChange} value={formData.bio} name="bio" id="bio"></textarea>
            </div>
            
            <div>
                <label htmlFor="firstName">First name:</label>
                <input type="text" onChange={handleInputChange} value={formData.firstName} name="firstName" id="firstName" />
            </div>
            
            <div>
                <label htmlFor="lastName">Last name: </label>
                <input type="text" onChange={handleInputChange} value={formData.lastName} name="lastName" id="lastName" />
            </div>
            
            <div>
                <label htmlFor="birthDate">Birthdate: </label>
                <input type="date" onChange={handleInputChange} value={formData.birthDate} name="birthDate" id="birthDate" />

                {errors.length > 0 && <Errors errors={errors} />}
            </div>

            <div className="edit-profile-actions">
                <button className="cancel-button" onClick={handleCancelUpdate}>Cancel</button>
                <button className="edit-profile-button" type="submit">Edit</button>
            </div>
            
        </form>
    </div>
  )
}
