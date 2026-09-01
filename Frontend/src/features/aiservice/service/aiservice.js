import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export async function ragSearch(query) {
  const response = await api.post("/api/rag-search", { query });
  return response.data;
}