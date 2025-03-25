import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { Errors } from "./Errors";

export const EditPostForm = ({ postInfo, setPosts, setIsEditing }) => {
    const [formData, setFormData] = useState({
        content: postInfo.content
    });
    const { errors, setErrors } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/posts/${postInfo.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: formData.content
                })
            });
            const data = await response.json();

            if (response.ok) {
                setPosts(prevPosts => prevPosts.map(p => p.id === postInfo.id ? data.post : p));
                setIsEditing(false);
            } else {
                setErrors([data.message]);
            }
        } catch (err) {
            setErrors(["Internal server error."]);
        };
    };

  return (
    <>
        {errors.length > 0 && <Errors errors={errors} />}

        <form onSubmit={handleSubmit}>
            <textarea onChange={e => setFormData({ content: e.target.value })} value={formData.content} name="content" id="content"></textarea>
            <button type="submit">Edit</button>
        </form>
    </>

  )
}
