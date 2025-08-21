import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../contexts/AuthContext";
import { EyeIcon, EyeOffIcon } from '../components/icons/PasswordIcons';
import { landingImg } from '../data/landingImg';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("jobseeker");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % landingImg.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const { username, password } = formData;
    const usernameRegex = /^[A-Za-z_]+$/;
    if (!usernameRegex.test(username)) {
      setError("Username can only contain letters and underscores.");
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        role,
      });

      if (response?.access && response?.refresh) {
        googleLogin(response.access, response.refresh, response.role);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.info("Account created. Please log in.");
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || err.message || "Registration failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };


  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex items-center px-2 py-2 font-inter">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-lg flex flex-col md:flex-row max-w-8xl w-full overflow-hidden">

        {/* Left: Image Section */}
        <div className="hidden md:flex relative w-full md:w-1/2 p-8 flex-col justify-between items-start">
          <div className="absolute inset-0 overflow-hidden">
            {landingImg.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Slide ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${i === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {landingImg.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-1.5 w-8 rounded-full transition duration-300 ${i === currentImageIndex ? "bg-white" : "bg-gray-400 opacity-50"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full h-4/5 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-8">
              <div className="text-white text-2xl font-bold rounded-xl px-4 py-2 bg-[hsl(var(--primary))]">
                JobLane
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-white text-[hsl(var(--foreground))] px-4 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
              >
                ← Back to website
              </button>
            </div>
            <h2 className="text-4xl font-semibold mb-8 text-white">{landingImg[currentImageIndex].slogan}</h2>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-8 flex flex-col text-center">
          <h1 className="section-heading">Create an Account</h1>
          <p className="text-gray-600 text-md mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 hover:underline font-medium">
              log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
            <div className="flex bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-xl p-1 w-max">
              {["jobseeker", "recruiter"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRole(type)}
                  className={`px-4 py-2 rounded-lg text-md font-medium transition-all duration-200 ${role === type ? "bg-[hsl(var(--primary))] text-white" : "text-[hsl(var(--foreground)/60%)]"}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <input
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              autoComplete="off"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First name"
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                autoComplete="off"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last name"
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                autoComplete="off"
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              autoComplete="off"
              required
            />

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[hsl(var(--foreground)/70%)] hover:text-[hsl(var(--foreground))] focus:outline-none cursor-pointer"
              >
                {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="accent-[hsl(var(--primary))] h-4 w-4"
                required
              />
              <label htmlFor="terms" className="text-[hsl(var(--foreground)/70%)] text-sm">
                I agree to the{' '}
                <a href="terms" className="text-[hsl(var(--primary))] hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-xl text-lg font-semibold shadow-md hover:opacity-90 transition-colors duration-200 cursor-pointer"
            >
              Sign up
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-[hsl(var(--border))]" />
            <span className="mx-4 text-[hsl(var(--foreground)/60%)]">Or Continue with</span>
            <hr className="flex-grow border-[hsl(var(--border))]" />
          </div>
          <GoogleLoginButton />
        </div>

      </div>
    </div>
  );
};

export default Register;
