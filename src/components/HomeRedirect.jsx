import { useAuth } from "../contexts/AuthContext";
import LandingPage from "../pages/LandingPage";
import JobSeekerHome from "../pages/jobseeker/JobSeekerHome";
import RecruiterHome from "../pages/recruiter/RecruiterHome";

function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <LandingPage />;
  if (user.role === "jobseeker") return <JobSeekerHome />;
  if (user.role === "recruiter") return <RecruiterHome />;

  // Fallback (optional)
  return <LandingPage />;
}

export default HomeRedirect;
