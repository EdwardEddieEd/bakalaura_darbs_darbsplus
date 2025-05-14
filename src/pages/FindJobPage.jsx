import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadJobsFromFirebase } from "../store/slices/firebaseSlice";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';


const FindJobPage = () => {
    const dispatch = useDispatch();
    const { jobs, error } = useSelector((state) => state.firebase);
    const [searchLocation, setSearchLocation] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [contactInfo, setContactInfo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(6);

    useEffect(() => {
        dispatch(loadJobsFromFirebase());
    }, [dispatch]);

    // Filtresana
    const filteredJobs = jobs.filter((job) => {
        return (
            (searchLocation === "" || job.location === searchLocation) &&
            (searchCategory === "" || job.category === searchCategory) &&
            (minSalary === "" || parseInt(job.salary) >= parseInt(minSalary)) &&
            (maxSalary === "" || parseInt(job.salary) <= parseInt(maxSalary))
        );
    });

    // Pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const goToPage = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }
    // modal 
    const handleShowContactInfo = (infoType, infoValue) => {
        setContactInfo({ type: infoType, value: infoValue });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <div className="absolute top-4 right-4 space-x-4 z-10 flex items-center">
                <Link
                    to="/profile"
                    className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-md transition"
                >
                    Profile
                </Link>
                <Link
                    to="/"
                    className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md transition"
                >
                    Back to HomePage
                </Link>
            </div>

            <h2 className="text-3xl text-center text-gray-200 mb-6">Find Jobs</h2>

            {/* Filters */}
            <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg mb-6 flex flex-col gap-4">
                <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="p-2 rounded-md text-black"
                >
                    <option value="">Select town</option>
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

                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="p-2 rounded-md text-black"
                >
                    <option value="">Select type of job</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                </select>

                {/* Salary */}
                <div className="flex space-x-4">
                    <input
                        type="number"
                        placeholder="Min salary (€)"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        className="p-2 rounded-md text-black w-full"
                    />
                    <input
                        type="number"
                        placeholder="Max salary (€)"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        className="p-2 rounded-md text-black w-full"
                    />
                </div>
            </div>

            {/* Job Listings */}
            <div className="w-full px-4">
                {currentJobs.length === 0 ? (
                    <p className="text-gray-300 text-center">No jobs available</p>
                ) : (
                    <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                        {currentJobs.map((job) => (
                            <div key={job.id} className="bg-gray-800 p-6 rounded-lg mb-6 hover:shadow-lg transition-transform transform hover:scale-105">
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

                                    {/* Right Section: Call Now and Send Email */}
                                    <div className="flex flex-col items-end flex-1">
                                        {job.contactPhone && (
                                            <button
                                                onClick={() => handleShowContactInfo("phone", job.contactPhone)}
                                                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-500 mb-4"
                                            >
                                                <FaPhoneAlt className="mr-2" />
                                                Call Now
                                            </button>
                                        )}

                                        {job.createdBy && (
                                            <button
                                                onClick={() => handleShowContactInfo("email", job.createdBy)}
                                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                                            >
                                                <FaEnvelope className="mr-2" />
                                                Send Email
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))} </div>
                )}
            </div>

            {/* Contact Info Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
                        <h3 className="text-xl text-white mb-4">Contact Info:</h3>
                        <p className="text-gray-300">
                            {contactInfo.type === "email" ? (
                                `Email: ${contactInfo.value}`
                            ) : (
                                `Phone: ${contactInfo.value}`
                            )}
                        </p>
                        <button
                            onClick={closeModal}
                            className="bg-red-600 text-white py-2 px-4 rounded mt-4 hover:bg-red-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-700 px-3 py-1 rounded text-white disabled:opacity-50"
                    >
                        Back
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => goToPage(index + 1)}
                            className={`px-3 py-1 rounded ${currentPage === index + 1
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-700 px-3 py-1 rounded text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    );
};

export default FindJobPage;
