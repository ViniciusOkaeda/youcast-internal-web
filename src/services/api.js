import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.0.56:3002",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
