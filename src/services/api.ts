import axios from "axios";

const api = axios.create({
 baseURL: "https://victory-contest-backend.vercel.app" + "/api",
  
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for CORS requests
});
export default api;
