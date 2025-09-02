import axios from "axios";

//const baseURL = "https://7wwb0knl-8080.euw.devtunnels.ms";
const baseURL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: baseURL + "/api",
  withCredentials: true,
});

export const telegramApi = axios.create({
  baseURL:
    "https://api.telegram.org/bot8328194489:AAF1Ul46yoR0XXkDF0bZeBXw37mol_vO68U",
});
export default api;
