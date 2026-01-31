import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token before each request
axiosInstance.interceptors.request.use((config) => {
  const storedLocal = localStorage.getItem("joblaneUser");
  const storedSession = sessionStorage.getItem("joblaneUser");
  const user = storedLocal
    ? JSON.parse(storedLocal)
    : storedSession
    ? JSON.parse(storedSession)
    : null;
  if (user?.access) {
    config.headers.Authorization = `Bearer ${user.access}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedLocal = localStorage.getItem("joblaneUser");
      const storedSession = sessionStorage.getItem("joblaneUser");
      const user = storedLocal
        ? JSON.parse(storedLocal)
        : storedSession
        ? JSON.parse(storedSession)
        : null;

      if (user?.refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: user.refresh,
          });

          const newAccess = res.data.access;

          // Save updated token in localStorage
          const updatedUser = { ...user, token: newAccess };

          if (localStorage.getItem("joblaneUser")) {
            localStorage.setItem("joblaneUser", JSON.stringify(updatedUser));
          } else if (sessionStorage.getItem("joblaneUser")) {
            sessionStorage.setItem("joblaneUser", JSON.stringify(updatedUser));
          }

          // Update request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("joblaneUser");
          sessionStorage.removeItem("joblaneUser");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
