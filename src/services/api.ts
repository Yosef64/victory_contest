import axios from "axios";

//const baseURL = "https://txnfqqn7-8081.euw.devtunnels.ms"; // Updated to dev tunnel backend

const baseURL = "http://localhost:8080";
const api = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});
export default api;
