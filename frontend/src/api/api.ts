import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API functions
export const fetchSlots = () => api.get("/slots");

export const bookSlot = (slotId: number, userId: number) =>
  api.post(`/book/${slotId}`, { user_id: userId });

export const createDoctor = (name: string) =>
  api.post("/admin/doctor", { name });

export const createSlot = (doctorId: number, startTime: string) =>
  api.post("/admin/slot", {
    doctor_id: doctorId,
    start_time: startTime,
  });
