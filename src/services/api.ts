import axios from "axios";

//const baseURL = "https://7wwb0knl-8080.euw.devtunnels.ms";
const baseURL = "http://localhost:8080";
const api = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});
export default api;
