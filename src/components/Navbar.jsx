import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-xl text-primary font-semibold"
      : "text-xl text-foreground hover:text-primary transition-colors";

  const commonLinks = (
    <>
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>

      {(!user || user.role === "jobseeker") && (
        <NavLink to="/jobs" className={navLinkClass}>
          Jobs
        </NavLink>
      )}
    </>
  );

  const guestLinks = (
     <>
     
    <NavLink
      to="/login"
      className="px-4 py-1 rounded-full border text-foreground border-black hover:bg-muted transition-colors"
    >
      Login
    </NavLink>
    <NavLink
      to="/register"
      className="px-4 py-1 rounded-full border border-blue-900 bg-primary text-white hover:bg-primary/90 transition-colors"
    >
      Sign Up
    </NavLink>
  </>
  );

  const jobseekerLinks = (
    <>
      <NavLink to="/saved" className={navLinkClass}>
        Saved
      </NavLink>
      <NavLink to="/applications" className={navLinkClass}>
        Applications
      </NavLink>
      <NavLink to="/profile" className={navLinkClass}>
        Profile
      </NavLink>
    </>
  );

  const recruiterLinks = (
    <>
      <NavLink to="/recruiter/post-job" className={navLinkClass}>
        Post Job
      </NavLink>
      <NavLink to="/recruiter/applicants" className={navLinkClass}>
        Applicants
      </NavLink>
    </>
  );

  return (
    <nav className="bg-background border-b border-border shadow-md sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center px-4 py-3 md:px-8">

        {/* Logo */}
        <NavLink to="/" className="text-3xl font-bold text-primary">
          JobLane
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center text-lg">
          {commonLinks}
          {!user && guestLinks}
          {user?.role === "jobseeker" && jobseekerLinks}
          {user?.role === "recruiter" && recruiterLinks}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-3xl text-foreground"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col gap-4 px-6 pb-4 text-lg bg-background border-t border-border transition-colors"
        >
          {commonLinks}
          {!user && (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={navLinkClass}
              >
                Sign Up
              </NavLink>
            </>
          )
          }
          {user?.role === "jobseeker" && jobseekerLinks}
          {user?.role === "recruiter" && recruiterLinks}
          {user && (
            <button
              onClick={handleLogout}
              className="text-xl text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
      
    </nav>
  );
}

export default Navbar;
