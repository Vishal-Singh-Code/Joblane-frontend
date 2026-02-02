import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeIcon, EyeOffIcon } from '../components/icons/PasswordIcons';
import { useAuth } from "../contexts/AuthContext";


const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // New state variable

  // get token from router state
  const resetToken = location.state?.reset_token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // if reset token is missing, redirect
  if (!resetToken) {
    toast.error("Invalid access to reset page");
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const resetData = {
        reset_token: resetToken,
        password: password,
        confirm_password: confirmPassword,
      };

      await resetPassword(resetData);

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"} // Use passwordVisible state
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest"
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
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"} // Use new state variable
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Control new state
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[hsl(var(--foreground)/70%)] hover:text-[hsl(var(--foreground))]"
            >
              {confirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;