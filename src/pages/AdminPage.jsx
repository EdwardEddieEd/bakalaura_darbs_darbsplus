import { useEffect, useState } from "react";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Link } from 'react-router-dom';

const AdminPage = () => {
    const [users, setUsers] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3000/users').then(res => {
                if (!res.ok) throw new Error('Failed to fetch users from server');
                return res.json();
            }),
            get(ref(getDatabase(), 'users')).then(snapshot => snapshot.exists() ? snapshot.val() : {})
        ]).then(([authUsers, dbUsers]) => {
            console.log('authUsers:', authUsers);
            console.log('dbUsers:', dbUsers);

            const usersObj = {};
            authUsers.forEach(user => {
                usersObj[user.uid] = {
                    email: user.email,
                    role: dbUsers[user.uid]?.role || 'user'
                };
            });
            setUsers(usersObj);
        }).catch(error => {
            console.error('Error loading users:', error);
        });

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setCurrentUserId(currentUser.uid);
        }
    }, []);
    const changeRole = (uid, newRole) => {
        const db = getDatabase();
        update(ref(db, `users/${uid}`), { role: newRole }).then(() => {
            setUsers((prev) => ({
                ...prev,
                [uid]: { ...prev[uid], role: newRole },
            }));
        });
    };

    const removeUserCompletely = async (uid) => {

        if (uid === currentUserId) {
            alert("You cannot delete yourself!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/users/${uid}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete user');
            }

            alert("User has been deleted from Authentication");

            const db = getDatabase();
            await remove(ref(db, `users/${uid}`));

            setUsers((prev) => {
                const updated = { ...prev };
                delete updated[uid];
                return updated;
            });
        } catch (error) {
            alert("Error deleting user: " + error.message);
        }
    };


    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link to="/profile" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition">
                    Profile
                </Link>
                <Link to="/" className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md transition">
                    Back to HomePage
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>

            <div className="space-y-4">
                {Object.entries(users).map(([uid, user]) => (
                    <div
                        key={uid}
                        className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
                    >
                        <div>
                            <p>Email: {user.email || "—"}</p>
                            <p>Role: {user.role}</p>
                        </div>

                        <div className="flex gap-2">
                            {user.role === "user" && (
                                <button
                                    onClick={() => changeRole(uid, "admin")}
                                    className="bg-blue-500 px-3 py-1 rounded"
                                >
                                    Change role to Admin
                                </button>
                            )}
                            {user.role === "admin" && (
                                <button
                                    onClick={() => changeRole(uid, "user")}
                                    className="bg-yellow-500 px-3 py-1 rounded"
                                >
                                    Change role to User
                                </button>
                            )}
                            <button
                                onClick={() => removeUserCompletely(uid)}
                                className="bg-red-500 px-3 py-1 rounded"
                            >
                                Delete user from system
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;