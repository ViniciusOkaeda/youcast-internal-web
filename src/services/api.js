import axios from "axios";

const api = axios.create({
  baseURL: "https://hub.youcast.tv.br/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default api;
