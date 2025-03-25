import { useContext } from "react";
import { NavLink, useNavigate } from "react-router"
import UserContext from "../context/UserContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { setErrors, user, setUser } = useContext(UserContext);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleLogout = async () => {
    try {
        const response = await fetch(`${baseUrl}/api/auth/logout`, {
          credentials: "include"
        });
        const data = await response.json();

        if (response.ok) {
          setUser(null);
        } else {
          setErrors([data.message]);
        };
    } catch (err) {
      setErrors(["Internal server error."]);
    }
    navigate("/");
  }

  return (
    <nav>
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink to={`/users/${user.id}`}>{user.username}</NavLink>
                </li>
                <li>
                  <NavLink to="/users">All users</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Log out</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/signup">Sign up</NavLink>
                </li>
                <li>
                  <NavLink to="/login">Log in</NavLink>
                </li>
              </>
            )}
        </ul>
    </nav>
  )
}
