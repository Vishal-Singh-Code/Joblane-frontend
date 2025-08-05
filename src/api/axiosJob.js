import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const axiosJob = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from either localStorage or sessionStorage
axiosJob.interceptors.request.use((config) => {
  const user =
    JSON.parse(localStorage.getItem("joblaneUser")) ||
    JSON.parse(sessionStorage.getItem("joblaneUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
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
          const res = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: user.refresh,
          });

          const newAccess = res.data.access;
          const updatedUser = { ...user, token: newAccess };

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
