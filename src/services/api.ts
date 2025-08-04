import axios from "axios";

const baseURL = "https://txnfqqn7-8081.euw.devtunnels.ms"; // Updated to dev tunnel backend
const api = axios.create({
  baseURL: baseURL + "/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials for CORS requests
});
export default api;
