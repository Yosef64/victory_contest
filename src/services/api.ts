import axios from "axios";

const baseURL = "https://7wwb0knl-8080.euw.devtunnels.ms";
const api = axios.create({
  baseURL: baseURL + "/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for CORS requests
});
export default api;
