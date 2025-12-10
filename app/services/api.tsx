import axios from "axios";

const api = axios.create({
    baseURL: "https://pqzs7h6sgdo23n2ano66himzoy0jwuxw.lambda-url.us-west-1.on.aws/",
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
