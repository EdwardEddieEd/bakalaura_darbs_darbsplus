import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveJobToFirebase } from "store/slices/firebaseSlice";
import { useAuth } from "hooks/auth-status";

const CreateJobPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { email, id } = useAuth();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [salary, setSalary] = useState("");
    const [contactPhone, setContactPhone] = useState("");

    const validateForm = () => {
        if (!title || !description || !startDate || !endDate || !category || !location || !salary) {
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

        const newJob = {
            id: Date.now().toString(),
            title,
            description,
            startDate,
            endDate,
            category,
            location,
            salary: `${salary} €`,
            createdBy: email || "Unknown",
            userId: id,
            contactPhone,
        };
        try {
            await dispatch(saveJobToFirebase(newJob));
            navigate("/findjob");
        } catch (error) {
            console.error("Error to create job:", error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white flex justify-center items-center p-6 relative">
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
            <div className="w-full max-w-xl bg-gray-800 shadow-lg rounded-xl p-8">
                <h2 className="text-3xl text-center text-gray-200 mb-6">Create a New Job</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Contact Phone */}
                    <div className="flex items-center">
                        <label htmlFor="contactPhone" className="text-gray-400 mr-4 w-1/3">Enter your Contact Phone</label>
                        <input
                            id="contactPhone"
                            type="tel"
                            placeholder="Contact Phone"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
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
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
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
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="p-2 rounded-md text-black flex-1"
                            />
                            <span className="ml-2 text-lg">€</span>
                        </div>
                    </div>

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md mt-4">
                        Create Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJobPage;
