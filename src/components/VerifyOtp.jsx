import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const RESEND_COOLDOWN = 30; // seconds

const VerifyOtp = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailParam = searchParams.get("email"); // get email from query param
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await verifyOtp(emailParam, otp);

      if (response?.token && response?.refresh) {
        toast.success("OTP verified successfully!");
        navigate("/");
      } else {
        toast.error("Failed to verify OTP. Try again.");
      }

    } catch (err) {
      console.error(err);
      const message = err.message || "OTP verification failed.";
      setError(message);
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      const response = await resendOtp(emailParam);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter the 6-digit OTP sent to <strong>{emailParam}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="number"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
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
