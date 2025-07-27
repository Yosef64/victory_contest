import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const api = axios.create({
  baseURL: baseURL + "/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for CORS requests
});
export default api;
