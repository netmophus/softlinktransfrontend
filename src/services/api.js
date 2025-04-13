import axios from "axios";

// Définir l'URL de base (assure-toi que le `.env` contient REACT_APP_API_URL=http://localhost:5000)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter un intercepteur pour attacher le token d'authentification (si nécessaire)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
