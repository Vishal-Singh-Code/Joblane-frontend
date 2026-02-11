import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const RESEND_COOLDOWN = 30;

const VerifyOtp = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);


  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification link.");
      navigate("/register");
      return;
    }

    setResendCooldown(RESEND_COOLDOWN);
  }, [email, navigate]);


  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);


  const handleVerify = async (e) => {
    e.preventDefault();
    // setError("");

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(email, otp);

      if (response?.access && response?.refresh) {
        toast.success("OTP verified successfully!");
        navigate("/");
      }
      else {
        toast.error("Failed to verify OTP. Try again.");
      }

    } catch (err) {
      console.error(err);
      const message = err.message || "OTP verification failed.";
      // setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;

    try {
      const response = await resendOtp(email);
      toast.success(response.message || "OTP resent successfully!");
      setOtp(""); // clear input
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      console.error(err);
      const message = err.message || "Failed to resend OTP.";
      toast.error(message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            pattern="\d{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit OTP"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
            autoFocus
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer "
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className={`text-blue-600 font-medium ${resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default VerifyOtp;
