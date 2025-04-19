import { useContext, useState } from "react"
import UserContext from "../context/UserContext";

export const PostForm = ({ setPosts }) => {
    const [formData, setFormData] = useState({
        content: ""
    });
    const { setErrors } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/api/posts`, {
                method: "POST",
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
                setPosts(prevPosts => [data.post, ...prevPosts]);
                setFormData({ content: "" });
            } else {
                setErrors([data.message]);
            };
        } catch (err) {
            setErrors(["Internal server error."]);
        };
    };
  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea onChange={e => setFormData({ content: e.target.value })} value={formData.content} name="content" id="content" required></textarea>
        <button type="submit">Post</button>
    </form>
  )
}
