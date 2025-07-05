import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

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

  const googleLogin = (accessToken, refreshToken, role) => {
    const userData = {
      token: accessToken,
      refresh: refreshToken,
      role: role,
    };
    localStorage.setItem("joblaneUser", JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (username, password, rememberMe = false) => {
    const res = await axios.post("/login/", { username, password });

    const access = res.data.token;
    const refresh = res.data.refresh;

    const userData = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      token: access,
      refresh: refresh,
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("joblaneUser", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (data) => {
    try {
      const res = await axios.post("/register/", data);
      return res.data;
    } catch (err) {
      throw new Error("Registration failed",err);
    }
  };

  const logout = () => {
    localStorage.removeItem("joblaneUser");
    sessionStorage.removeItem("joblaneUser");
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, logout, register, googleLogin } },
    children
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
