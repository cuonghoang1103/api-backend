import axios from "axios";

// API BASE URL given by the paper
const api = axios.create({ baseURL: "http://localhost:9999" });
export default api;
