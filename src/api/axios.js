import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://joblane-backend-0eqs.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token before each request
axiosInstance.interceptors.request.use((config) => {
  const user =
    JSON.parse(localStorage.getItem("joblaneUser")) ||
    JSON.parse(sessionStorage.getItem("joblaneUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Refresh token on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const user = JSON.parse(localStorage.getItem("joblaneUser"));
      if (user?.refresh) {
        try {
          const res = await axios.post("https://joblane-backend-0eqs.onrender.com/api/refresh/", {
            refresh: user.refresh,
          });

          const newAccess = res.data.access;

          // Save updated token in localStorage
          const updatedUser = { ...user, token: newAccess };
          localStorage.setItem("joblaneUser", JSON.stringify(updatedUser));

          // Update request with new access token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("joblaneUser");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
