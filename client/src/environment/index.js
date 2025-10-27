export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== "undefined" ? `${window.location.origin.replace(/:\\d+$/, '')}:4000/api` : "http://localhost:4000/api");

export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

export default {
  API_BASE_URL,
  CLIENT_URL,
};

