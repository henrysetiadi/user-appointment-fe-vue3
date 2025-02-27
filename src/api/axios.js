import axios from 'axios';
import router from "@/router"; // Vue Router for redirection
import authService from "@/api/authService";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Token to Requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get token from storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Unauthorized Responses
api.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("[DEBUG] Invalid token detected, logging out...");

      // Perform logout
      authService.logout();

      // Redirect to login page
      router.replace('/login');
      location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
