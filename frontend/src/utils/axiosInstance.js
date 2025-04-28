import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/", //"https://zenjade.onrender.com""https://zatpl-backend.onrender.com/","https://zenjade.onrender.com""http://localhost:5000/"
  headers: { "Content-Type": "application/json" },
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      "Something went wrong. Please try again!";
    console.error(error);
    return Promise.reject(errorMessage); // Send only message, avoid full error object
  }
);

export default axiosInstance;
