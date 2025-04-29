import { Navigate } from "react-router-dom";
import { useAuth } from 'hooks/auth-status';
import { useDispatch } from 'react-redux';
import { removeUser } from 'store/slices/userSlice';
import { Link } from "react-router-dom";

const HomePage = () => {
    const dispatch = useDispatch();
    const { isAuth, email } = useAuth();

    return isAuth ? (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white p-6 relative">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-xl p-8 mt-[175px]">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">Darbs+</h2>
                <h2 className="text-xl text-center mb-6 text-gray-400">Welcome, {email}</h2>

            </div>

            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link
                    to="/profile"
                    className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition"
                >
                    Profile
                </Link>
                <button
                    className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md transition"
                    onClick={() => dispatch(removeUser())}
                >
                    Log out
                </button>
            </div>

            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-xl p-8 mt-6">
                <div className="flex flex-col gap-4 items-center">
                    <Link to="/findjob" className="text-blue-400 hover:text-blue-300 text-xl transition">
                        Find a short-time job
                    </Link>
                    <Link to="/createjob" className="text-blue-400 hover:text-blue-300 text-xl transition">
                        Create a new short-time job
                    </Link>
                </div>
            </div>
        </div>
    ) : (
        <Navigate to="/login" />
    );
}

export default HomePage;
