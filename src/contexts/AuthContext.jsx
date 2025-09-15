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

  const login = async (username, password, rememberMe = false) => {
    const res = await axiosInstance.post("/login/", { username, password });

    const userData = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      token: res.data.token,
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
      token: accessToken,
      refresh: refreshToken,
      role,
    };
    localStorage.setItem("joblaneUser", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/register/", data);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.detail || "Registration failed");
    }
  };

  const logout = async (redirect = "/login") => {
    try {
      const stored =
        localStorage.getItem("joblaneUser") ||
        sessionStorage.getItem("joblaneUser");
      const parsed = stored && JSON.parse(stored);

      if (parsed?.refresh) {
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/logout/`, {
          refresh_token: parsed.refresh,
        },
          {
            headers: {
              Authorization: `Bearer ${parsed.token}`,
            }
          });
      }
    } catch (err) {
      console.warn("Token revoke failed:", err?.response?.data || err.message);
    } finally {
      localStorage.removeItem("joblaneUser");
      sessionStorage.removeItem("joblaneUser");
      setUser(null);
      if (redirect) window.location.href = redirect;
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
        token: res.data.access,   // use `access` instead of `token`
        refresh: res.data.refresh,
      };

      localStorage.setItem("joblaneUser", JSON.stringify(userData));
      setUser(userData);

      return userData;
    } catch (err) {
      throw new Error(err?.response?.data?.error || "OTP verification failed");
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


  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
      googleLogin,
      verifyOtp,
      resendOtp,
      setUser,
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
