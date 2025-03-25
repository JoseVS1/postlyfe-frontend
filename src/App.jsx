import { Navbar } from "./components/Navbar"
import { Routes, Route } from "react-router"
import { HomePage } from "./components/pages/HomePage"
import { SignupPage } from "./components/pages/SignupPage"
import { LoginPage } from "./components/pages/LoginPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { useEffect, useState } from "react"
import UserContext from "./context/UserContext"
import { PostPage } from "./components/pages/PostPage"
import { ProfilePage } from "./components/pages/ProfilePage"
import { UsersPage } from "./components/pages/UsersPage"

export const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/status`, {
          credentials: "include"
        });
        const data = await response.json();

        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        };
        
        setLoading(false);
      } catch (err) {
        setErrors(["Internal server error."]);
      }
    };

    checkIsAuthenticated();
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, posts, setPosts, errors, setErrors}}>
      <Navbar />

      <Routes>
        <Route path="/" element={
          <ProtectedRoute user={user} loading={loading}>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/posts/:id" element={
          <ProtectedRoute user={user} loading={loading}>
            <PostPage />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute user={user} loading={loading}>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={
          <ProtectedRoute user={user} loading={loading}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        </Routes>
    </UserContext.Provider>
  )
}
