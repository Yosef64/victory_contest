import axios from "axios";

//const baseURL = "https://7wwb0knl-8080.euw.devtunnels.ms";
const baseURL = "https://txnfqqn7-8081.euw.devtunnels.ms";
const api = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});
export default api;
