import { useContext, useEffect, useState } from "react"
import { Link } from "react-router";
import { UserCard } from "../UserCard";
import UserContext from "../../context/UserContext";
import { Errors } from "../Errors";

export const UsersPage = () => {
    const [users, setUsers] = useState(null);
    const [pendingUsers, setPendingUsers] = useState(null);
    const [acceptedUsersIds, setAcceptedUsersIds] = useState(null);
    const { errors, setErrors } = useContext(UserContext);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/users`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    setUsers(data.users);
                } else {
                    setErrors([data.message]);
                };
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getUsers();
    }, []);

    useEffect(() => {
        const getPendingUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/users?pending=true`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    setPendingUsers(data.users);
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            };
        };

        getPendingUsers();
    }, []);

    useEffect(() => {
        const getAcceptedUsersIds = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/follows?accepted=true`, {
                    credentials: "include"
                });
                const data = await response.json();
                
                console.log(data)
                if (response.ok) {
                    setAcceptedUsersIds(data.followersStatus.map(s => s.userId));
                } else {
                    setErrors([data.message]);
                }
            } catch (err) {
                setErrors(["Internal server error."]);
            }
        };

        getAcceptedUsersIds();
    });

  return (
    <div className="users-page">
        {errors.length > 0 && <Errors errors={errors} />}
        
        {users && (
            <div>
                {pendingUsers && pendingUsers.length > 0 && (
                    <div>
                        <h2>Pending requests</h2>

                        <ul className="user-list">
                            {pendingUsers.map(u => (
                                <li key={u.id}>
                                    <UserCard user={u} pending={true} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h2>All users</h2>

                    <ul className="user-list">
                        {users.map(user => (
                            <li key={user.id}>
                                <UserCard user={user} acceptedUsersIds={acceptedUsersIds} />
                            </li>
                        ))}                        
                    </ul>
                </div>
            </div>
        )}
    </div>
  )
}