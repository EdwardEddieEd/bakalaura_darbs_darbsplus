import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const PasswordReset = ({ closeModal }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset link has been sent to your email');
            setEmail('');
            setError('');
            setTimeout(() => {
                closeModal();
            }, 3000);
        } catch (err) {
            setError('Error, please check if the email is correct');
            setMessage('');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-200">Forgot your password?</h1>
            <p className="text-gray-400 text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Send Reset Link
                </button>

                {message && <p className="text-green-500 mt-4 text-center">{message}</p>}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </form>


        </div>
    );
};

export default PasswordReset;
