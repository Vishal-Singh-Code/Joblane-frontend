import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { landingImg } from '../data/landingImg';
import { EyeIcon, EyeOffIcon } from '../components/icons/PasswordIcons';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % landingImg.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);

    try {
      await login(formData.username, formData.password, rememberMe);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      const errorData = err?.response?.data;

      if (typeof errorData?.detail === "string") {
        message = errorData.detail;
      } else if (errorData && typeof errorData === "object") {
        message = Object.values(errorData).flat().join(" ");
      } else if (err.message) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center px-2 font-inter text-[hsl(var(--foreground))]">
      <div className="bg-[hsl(var(--card))] rounded-2xl shadow-lg flex flex-col md:flex-row w-full max-w-8xl overflow-hidden border border-[hsl(var(--border))]">

        {/* Left: Image Section */}
        <div className="text-white hidden md:flex relative w-full md:w-1/2 p-8 flex-col justify-between items-start">
          <div className="absolute inset-0">
            {landingImg.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Slide ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentImageIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {landingImg.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`h-1.5 w-8 rounded-full transition ${i === currentImageIndex ? "bg-white" : "bg-gray-400 opacity-50"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col justify-between">
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
            <h2 className="text-4xl font-semibold mb-8">{landingImg[currentImageIndex].slogan}</h2>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col text-center ">
          <h1 className="section-heading">Welcome Back</h1>
          <p className="text-gray-600 text-md mb-8">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              required
            />

            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--foreground)/60%)] p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[hsl(var(--foreground)/70%)] hover:text-[hsl(var(--foreground))]"
              >
                {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-blue-700 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="accent-[hsl(var(--primary))] w-5 h-5"
              />
              <label htmlFor="remember" className="text-[hsl(var(--foreground)/70%)] text-sm">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] py-3 rounded-xl text-lg font-semibold shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Logging In..." : "Log In"}
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

export default Login;
