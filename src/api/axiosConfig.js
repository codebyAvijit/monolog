// src/api/axiosConfig.js
import axios from "axios";

//  Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // ⏱️ increased to 30s for stability
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//  Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");

    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error responses
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized access - redirecting to login");
          // Clear auth data and redirect to login
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          // Only redirect if not already on login page
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network error:", error.message);
    } else {
      const { status, data } = error.response;
      console.error(`⚠️ API error ${status}:`, data);
    }

    return Promise.reject(error); // Always reject to be caught by asyncThunk
  }
);

export default axiosInstance;
