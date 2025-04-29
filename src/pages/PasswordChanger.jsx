import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserPassword } from '../store/slices/firebaseSlice';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const PasswordChanger = () => {
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.firebase);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [reauthError, setReauthError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('password don`t match');
            return;
        }
        if (newPassword.length < 6) {
            alert('password has to be more than 6 simbols');
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            dispatch(changeUserPassword(newPassword));

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setReauthError('');

            setSuccessMessage('Password succesfully changed');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);


        } catch (err) {
            console.error('Reauth error:', err);
            setReauthError('Login error, please check your password');
        }
    };

    return (
        <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg mb-6 mt-6">
            <h3 className="text-xl font-semibold text-white">Change password</h3>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <input
                    type="password"
                    placeholder="Current password"
                    className="w-full p-2 rounded border text-black"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-2 rounded border text-black"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-2 rounded border text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                >
                    {loading ? 'Saving...' : 'Change password'}
                </button>
                {message && <p className="text-green-500">{message}</p>}
                {(error || reauthError) && (
                    <p className="text-red-500">{reauthError || error}</p>
                )}
            </form>
            {successMessage && (
                <p className="text-green-500 mt-4">{successMessage}</p>
            )}
        </div>
    );
};

export default PasswordChanger;
