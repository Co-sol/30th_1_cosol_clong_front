import axios from "axios";

const instance = axios.create({
  baseURL: "http://13.62.4.52:8000/api"
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  },
  (error) => Promise.reject(error)
);

export default instance;
