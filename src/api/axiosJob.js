import axios from "axios";
import { API_BASE, AUTH_BASE } from "../config/api";


const axiosJob = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from either localStorage or sessionStorage
axiosJob.interceptors.request.use((config) => {
  const user =
    JSON.parse(localStorage.getItem("joblaneUser")) ||
    JSON.parse(sessionStorage.getItem("joblaneUser"));
  if (user?.access) {
    config.headers.Authorization = `Bearer ${user.access}`;
  }
  return config;
});

// Refresh token logic
axiosJob.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get from whichever is available
      const user =
        JSON.parse(localStorage.getItem("joblaneUser")) ||
        JSON.parse(sessionStorage.getItem("joblaneUser"));

      if (user?.refresh) {
        try {
          const res = await axios.post(`${AUTH_BASE}/refresh/`, {
            refresh: user.refresh,
          });

          const newAccess = res.data.access;
          const updatedUser = { ...user, access: newAccess };

          // Store updated token in the same storage the user came from
          if (localStorage.getItem("joblaneUser")) {
            localStorage.setItem("joblaneUser", JSON.stringify(updatedUser));
          } else if (sessionStorage.getItem("joblaneUser")) {
            sessionStorage.setItem("joblaneUser", JSON.stringify(updatedUser));
          }

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosJob(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clean up from both storages just in case
          localStorage.removeItem("joblaneUser");
          sessionStorage.removeItem("joblaneUser");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosJob;
