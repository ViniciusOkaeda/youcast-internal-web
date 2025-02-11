import axios from "axios";

const api = axios.create({
  baseURL: "http://10.10.150.158:3002",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
