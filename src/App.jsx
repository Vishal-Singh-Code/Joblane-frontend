import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
//components
import Layout from './components/Layout';
import HomeRedirect from './components/HomeRedirect';
import AuthLayout from './components/AuthLayout';


// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import JobSearch from './pages/jobseeker/JobSearch';
import Profile from './pages/jobseeker/Profile';
import SavedJobs from './pages/jobseeker/SavedJobs';
import Applications from './pages/jobseeker/Applications';
import PostJob from './pages/recruiter/PostJob';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import Missing from './pages/Missing';
import JobDetails from './pages/jobseeker/JobDetails';
import ApplicantDetail from './pages/recruiter/ApplicantDetail';
import JobList from './pages/recruiter/JobList';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>

            {/* Public links */}
            <Route index element={<HomeRedirect />} />
            <Route path="jobs" element={<JobSearch />} />

            {/* Job Seeker Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['jobseeker']} />}>
              <Route path="job/:id" element={<JobDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="saved" element={<SavedJobs />} />
              <Route path="applications" element={<Applications />} />
            </Route>

            {/* Recruiter Protected Routes */}
            <Route path="recruiter" element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="post-job" element={<PostJob />} />
              <Route path="jobList" element={<JobList />} />
              <Route path="company_profile" element={<CompanyProfile />} />
              <Route path="jobs/:id/applicants" element={<ViewApplicants />} />
              <Route path="applicant/:id" element={<ApplicantDetail />} />
            </Route>
            
            <Route path='*' element={<Missing />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="register" element={<Register />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword/>}/>
            <Route path="forgot-password/verify-otp" element={<VerifyResetOtp />} />
            <Route path="forgot-password/reset" element={<ResetPassword/>}/>
          </Route>

        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
