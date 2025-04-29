import { Link } from "react-router-dom";
import { Login } from "components/Login";
import PasswordReset from "../pages/PasswordReset";
import { useState } from "react";

const LoginPage = () => {
    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);
    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-xl p-8 mt-[175px]">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">Login</h1>

                <Login />

                <p className="text-gray-400 text-center mt-4">
                    Or{" "}
                    <Link to="/registration" className="text-blue-400 hover:text-blue-300 transition">
                        Registration
                    </Link>
                </p>
                <p className="text-gray-400 text-center mt-4">
                    <button
                        onClick={handleModalOpen}
                        className="text-blue-400 hover:text-blue-300 transition"
                    >
                        Forgot password?
                    </button>
                </p>
            </div>

            {/* Module page reset password*/}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-gray-800 p-6 rounded-lg w-1/3">
                        <PasswordReset closeModal={handleModalClose} />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleModalClose}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
