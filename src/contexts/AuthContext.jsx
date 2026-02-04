import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios";
import axios from "axios";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("joblaneUser") ||
      sessionStorage.getItem("joblaneUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/register/", data);
      return res.data;
    } catch (err) {
      // Throw the actual backend error object
      throw err.response?.data || { error: "Registration failed" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const res = await axiosInstance.post("/verify-otp/", { email, otp });

      const userData = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        access: res.data.access,
        refresh: res.data.refresh,
      };

      localStorage.setItem("joblaneUser", JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.non_field_errors?.[0] || err.message || "Something went wrong";
      throw new Error(msg);

    }
  };

  const resendOtp = async (email) => {
    try {
      const res = await axiosInstance.post("/send-otp/", { email });
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.error || "Failed to resend OTP");
    }
  };

  const login = async (username, password, rememberMe = false) => {
    const res = await axiosInstance.post("/login/", { username, password });

    const userData = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      access: res.data.access,
      refresh: res.data.refresh,
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("joblaneUser", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const googleLogin = (accessToken, refreshToken, role, id, email, name) => {
    const userData = {
      id,
      name,
      email,
      access: accessToken,
      refresh: refreshToken,
      role,
    };
    if (accessToken && refreshToken) {
      localStorage.setItem("joblaneUser", JSON.stringify(userData));
    }

    setUser(userData);
  };

  // const logout = async (redirect = "/login") => {
  //   try {
  //     const stored =
  //       localStorage.getItem("joblaneUser") ||
  //       sessionStorage.getItem("joblaneUser");
  //     const parsed = stored && JSON.parse(stored);

  //     if (parsed?.refresh) {
  //       await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/logout/`, {
  //         refresh_token: parsed.refresh,
  //       },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${parsed.access}`,
  //           }
  //         });
  //     }
  //   } catch (err) {
  //     console.warn("Token revoke failed:", err?.response?.data || err.message);
  //   } finally {
  //     localStorage.removeItem("joblaneUser");
  //     sessionStorage.removeItem("joblaneUser");
  //     setUser(null);
  //     if (redirect) window.location.href = redirect;
  //   }
  // };

  const logout = (redirect = "/login") => {
    // 1️⃣ IMMEDIATE UI ACTION (user feels instant logout)
    localStorage.removeItem("joblaneUser");
    sessionStorage.removeItem("joblaneUser");
    setUser(null);

    if (redirect) window.location.href = redirect;

  };


  const forgotPassword = async (email) => {
    try {
      const res = await axiosInstance.post("/forgot-password/", { email });
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  const verifyForgotOtp = async (email, otp) => {
    try {
      const res = await axiosInstance.post("/forgot-password/verify-otp/", { email, otp });
      return res.data;
    } catch (err) {
      console.error("verifyForgotOtp error:", err.response?.data || err.message);
      throw new Error(
        err?.response?.data?.error ||
        err?.response?.data?.non_field_errors?.[0] ||
        err.message ||
        "Something went wrong"
      );
    }
  };

  // const resendForgotOtp = async (email) => {
  //   try {
  //     const res = await axiosInstance.post("/forgot-password/", { email });
  //     return res.data;
  //   } catch (err) {
  //     const msg = err?.response?.data?.error || err.message;
  //     throw new Error(msg);
  //   }
  // };

  const resetPassword = async (data) => {
    try {
      const res = await axiosInstance.post("/forgot-password/reset/", data);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.error || "Password reset failed");
    }
  };


  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      register,
      verifyOtp,
      resendOtp,
      login,
      logout,
      googleLogin,
      forgotPassword,
      verifyForgotOtp,
      // resendForgotOtp,
      resetPassword
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthProvider };
