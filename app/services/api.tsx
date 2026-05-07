import axios from "axios";
import { API_URL_BASE } from "../config/api";

const api = axios.create({
    baseURL: API_URL_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
