import { useContext, useState } from "react";
import UserContext from "../context/UserContext";

export const CommentForm = ({ postId, setComments, setPost }) => {
    const [formData, setFormData] = useState({
        text: ""
    });
    const { setErrors, user } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleSubmit = async e => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${baseUrl}/api/comments`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: formData.text,
                    userId: user.id,
                    postId
                })
            });
            const data = await response.json();

            if (response.ok) {
                setPost(data.post);
                setComments(prevComments => [data.comment, ...prevComments]);
                setFormData({ text: "" });
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        }
    };

    const handleInputChange = e => {
        setFormData({
            text: e.target.value
        });
    };
  return (
    <form className="create-comment-form" onSubmit={handleSubmit}>
        <textarea onChange={handleInputChange} value={formData.text} name="text" id="text" required>{formData.text}</textarea>
        <button type="submit">Submit</button>
    </form>
  )
}