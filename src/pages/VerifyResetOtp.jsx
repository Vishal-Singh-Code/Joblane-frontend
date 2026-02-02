import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const RESEND_COOLDOWN = 30;

const VerifyResetOtp = () => {
  const { verifyForgotOtp, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);


  useEffect(() => {
    if (!email) {
      toast.error("Invalid or expired reset link.");
      navigate("/forgot-password");
      return;
    }

    setCooldown(RESEND_COOLDOWN);
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyForgotOtp(email, otp);
      toast.success("OTP verified successfully!");
      navigate("/forgot-password/reset", {
        state: { reset_token: res.reset_token },
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    try {
      await forgotPassword(email);
      toast.success("OTP resent successfully!");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Reset OTP
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the OTP sent to{" "}
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            pattern="\d{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit OTP"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 "
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {cooldown > 0 ? (
            <p className="font-medium opacity-50 cursor-not-allowed">
              Resend OTP in {cooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className="text-blue-600 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default VerifyResetOtp;
