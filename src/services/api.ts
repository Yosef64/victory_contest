import axios from "axios";

//const baseURL = "http://localhost:8080";
const baseURL = "https://txnfqqn7-8081.euw.devtunnels.ms";
const api = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});
export default api;
