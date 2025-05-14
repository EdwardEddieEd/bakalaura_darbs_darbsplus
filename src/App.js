import { Routes, Route } from "react-router-dom"
import LoginPage from "pages/LoginPage";
import HomePage from "pages/HomePage";
import RegistrationPage from "pages/RegistrationPage";
import ProfilePage from "pages/ProfilePage";
import FindJobPage from "pages/FindJobPage";
import CreateJobPage from "pages/CreateJobPage";
import EditJobPage from "pages/EditJobPage";
import AdminPage from 'pages/AdminPage';
import AdminRoute from 'components/AdminRoute';


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/findjob" element={<FindJobPage />} />
      <Route path="/createjob" element={<CreateJobPage />} />
      <Route path="/editjob/:id" element={<EditJobPage />} />
      <Route path="/admin" element={<AdminRoute allowedRoles={['admin']}> <AdminPage /> </AdminRoute>} />
    </Routes>
  );
}

export default App;
