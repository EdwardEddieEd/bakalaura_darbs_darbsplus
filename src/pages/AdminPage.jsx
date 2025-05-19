import { useEffect, useState } from "react";
import { getDatabase, ref, get, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Link } from 'react-router-dom';

const AdminPage = () => {
    const [users, setUsers] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredAdmins = Object.entries(users).filter(
        ([uid, user]) =>
            user.role === 'admin' &&
            (uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredUsers = Object.entries(users).filter(
        ([uid, user]) =>
            user.role === 'user' &&
            (uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const UserCard = ({ uid, user }) => {
        const isAdmin = user.role === "admin";
        return (
            <div
                className={`flex flex-col md:flex-row md:justify-between md:items-center p-4 rounded-lg border transition ${isAdmin ? "border-blue-500 bg-blue-950/40" : "border-gray-600 bg-gray-800/60"
                    }`}
            >
                <div className="mb-2 md:mb-0">
                    <p className="text-white text-base font-semibold">{user.email || "—"}</p>
                    <p className="text-sm text-gray-400">
                        UID: <span className="font-mono text-green-400">{uid}</span>
                    </p>
                    <p className="text-sm mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium tracking-wide ${isAdmin ? "bg-blue-600 text-white" : "bg-yellow-400 text-black"
                            }`}>
                            {user.role}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-2 text-sm">
                    {user.role === "user" && (
                        <button
                            onClick={() => changeRole(uid, "admin")}
                            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded transition"
                        >
                            Change role to Admin
                        </button>
                    )}
                    {user.role === "admin" && (
                        <button
                            onClick={() => changeRole(uid, "user")}
                            className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded transition"
                        >
                            Change role to User
                        </button>
                    )}
                    <button
                        onClick={() => removeUserCompletely(uid)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    };


    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link to="/profile" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition">
                    Profile
                </Link>
                <Link to="/" className="bg-green-500 text-white px-4 py-2 rounded">
                    Back to HomePage
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>

            <input
                type="text"
                placeholder="Search by UID or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-6 px-4 py-2 rounded w-full text-black"
            />

            <h2 className="text-2xl font-semibold mb-2 border-b border-blue-300 pb-1">
                Administrators
            </h2>
            <div className="space-y-4 mb-8">
                {filteredAdmins.length === 0 ? (
                    <p>No admins found.</p>
                ) : (
                    filteredAdmins.map(([uid, user]) => (
                        <UserCard key={uid} uid={uid} user={user} />
                    ))
                )}
            </div>

            <h2 className="text-2xl font-semibold mb-2 border-b border-gray-500 pb-1">
                Users
            </h2>
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    filteredUsers.map(([uid, user]) => (
                        <UserCard key={uid} uid={uid} user={user} />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPage;