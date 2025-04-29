import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteJobFromFirebase, loadJobsFromFirebase } from '../store/slices/firebaseSlice';
import { useAuth } from "hooks/auth-status";
import PasswordChanger from '../pages/PasswordChanger';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ProfilePage = () => {
    const { email, id } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { jobs } = useSelector(state => state.firebase);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        dispatch(loadJobsFromFirebase());
    }, [dispatch]);

    const myJobs = jobs.filter(job => job.userId === id);

    const handleEditJob = (job) => {
        navigate(`/editjob/${job.id}`);
    };
    const handleDeleteJob = (jobId) => {
        dispatch(deleteJobFromFirebase(jobId));
    };

    const handlePasswordModal = (open) => {
        setShowPasswordModal(open);
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link
                    to="/"
                    className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md transition"
                >
                    Back to HomePage
                </Link>
            </div>

            <h2 className="text-3xl text-center text-gray-200 mb-6">My Profile</h2>

            <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-white">User Info</h3>
                <p className="text-gray-300">Email: {email}</p>
                <p className="text-gray-300">User ID: {id}</p>

                <div className="flex justify-between items-center mb-4"></div>
                <button
                    onClick={() => handlePasswordModal(true)}
                    className="bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-500"
                >
                    Reset Password
                </button>
            </div>

            {/* Show modal for changing password */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <div className="bg-gray-800 p-6 rounded-lg w-1/3">
                        <PasswordChanger onOpen={handlePasswordModal} />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => handlePasswordModal(false)}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">My Job Listings</h3>
                    <Link
                        to="/createjob"
                        className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-500"
                    >
                        Create a new short-time job
                    </Link>
                </div>

                {myJobs.length === 0 ? (
                    <p className="text-gray-300">You haven't created any jobs yet.</p>
                ) : (
                    myJobs.map((job) => (
                        <div key={job.id} className="bg-gray-700 p-6 rounded-lg mb-6 hover:shadow-lg transition-transform transform hover:scale-105">
                            {/* Job Title and Description */}
                            <h3 className="text-2xl font-semibold text-white mb-2">{job.title}</h3>
                            <p className="text-gray-300 mb-2 overflow-y-auto break-words">{job.description}</p>

                            <div className="flex gap-4 text-gray-400 mb-4">
                                {/* Left Section: Date, Location, Salary */}
                                <div className="flex-2">
                                    <div className="flex items-center mb-4">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        <span className="font-semibold">Start Date - End Date:</span> <span className="ml-2">{job.startDate} - {job.endDate}</span>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                                        <span className="font-semibold">Location:</span> <span className="ml-2">{job.location}</span>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <FaMoneyBillWave className="mr-2 text-green-500" />
                                        <span className="font-semibold">Salary:</span> <span className="ml-2">{job.salary}</span>
                                    </div>
                                </div>

                                {/* Right Section: Edit and Delete buttons */}
                                <div className="flex flex-col items-end flex-1">
                                    <button
                                        onClick={() => handleEditJob(job)}
                                        className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-400 mb-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
