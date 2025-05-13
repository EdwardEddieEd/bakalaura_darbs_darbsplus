import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, get, update } from "firebase/database";
import { database } from '../firebase';
import { loadJobsFromFirebase } from 'store/slices/firebaseSlice';

const EditJobPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobRef = ref(database, `jobs/${id}`);
                const snapshot = await get(jobRef);

                if (snapshot.exists()) {
                    setJob(snapshot.val());
                } else {
                    navigate('/profile');
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, navigate]);

    const validateForm = () => {
        if (!job.title || !job.description || !job.startDate || !job.endDate || !job.category || !job.location || !job.salary) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert("Please fill all required fields.");
            return;
        }

        if (!job) return;

        try {
            const jobRef = ref(database, `jobs/${id}`);
            await update(jobRef, job);
            dispatch(loadJobsFromFirebase());

            navigate('/profile');
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    if (!job) return null;

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex justify-center items-center p-6 relative">
            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link to="/profile" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition">
                    Profile
                </Link>
                <Link to="/" className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md transition">
                    Back to HomePage
                </Link>
            </div>
            <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-xl p-8">
                <h2 className="text-3xl text-center text-gray-200 mb-6">Edit Job</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Contact Phone */}
                    <div className="flex items-center">
                        <label htmlFor="contactPhone" className="text-gray-400 mr-4 w-1/3">Enter your Contact Phone</label>
                        <input
                            id="contactPhone"
                            type="text"
                            placeholder="Contact Phone"
                            value={job.contactPhone}
                            onChange={(e) => setJob({ ...job, contactPhone: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        />
                    </div>

                    {/* Job Title */}
                    <div className="flex items-center">
                        <label htmlFor="title" className="text-gray-400 mr-4 w-1/3">
                            Enter your Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Job Title"
                            value={job.title}
                            onChange={(e) => setJob({ ...job, title: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="flex items-center">
                        <label htmlFor="description" className="text-gray-400 mr-4 w-1/3">
                            Enter Job Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            placeholder="Job Description"
                            value={job.description}
                            onChange={(e) => setJob({ ...job, description: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="flex items-center">
                        <label htmlFor="startDate" className="text-gray-400 mr-4 w-1/3">
                            Enter Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={job.startDate}
                            onChange={(e) => setJob({ ...job, startDate: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        />
                    </div>

                    {/* End Date */}
                    <div className="flex items-center">
                        <label htmlFor="endDate" className="text-gray-400 mr-4 w-1/3">
                            Enter End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={job.endDate}
                            onChange={(e) => setJob({ ...job, endDate: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        />
                    </div>

                    {/* Category */}
                    <div className="flex items-center">
                        <label htmlFor="category" className="text-gray-400 mr-4 w-1/3">
                            Select Job Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={job.category}
                            onChange={(e) => setJob({ ...job, category: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        >
                            <option value="">Select type of job</option>
                            <option value="Remote">Remote</option>
                            <option value="On-site">On-site</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div className="flex items-center">
                        <label htmlFor="location" className="text-gray-400 mr-4 w-1/3">
                            Select Job Location <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="location"
                            value={job.location}
                            onChange={(e) => setJob({ ...job, location: e.target.value })}
                            className="p-2 rounded-md text-black flex-1"
                        >
                            <option value="">Select your town</option>
                            <option value="Riga">Riga</option>
                            <option value="Daugavpils">Daugavpils</option>
                            <option value="Liepaja">Liepaja</option>
                            <option value="Jelgava">Jelgava</option>
                            <option value="Jurmala">Jurmala</option>
                            <option value="Ventspils">Ventspils</option>
                            <option value="Rezekne">Rezekne</option>
                            <option value="Ogre">Ogre</option>
                            <option value="Valmiera">Valmiera</option>
                            <option value="Jūrmala">Jūrmala</option>
                        </select>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center">
                        <label htmlFor="salary" className="text-gray-400 mr-4 w-1/3">
                            Enter Salary <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center flex-1">
                            <input
                                id="salary"
                                type="number"
                                placeholder="Salary"
                                value={job.salary.replace(' €', '')}
                                onChange={(e) => setJob({ ...job, salary: `${e.target.value} €` })}
                                className="p-2 rounded-md text-black flex-1"
                            />
                            <span className="ml-2 text-lg">€</span>
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white py-2 rounded-md mt-4">
                        Update Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditJobPage;
