import { Link } from "react-router-dom";
import { Registration } from "components/Registration";

const RegistrationPage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
            <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-xl p-8 mt-[175px]">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">Registration</h1>

                <Registration />

                <p className="text-gray-400 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;
