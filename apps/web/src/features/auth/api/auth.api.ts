import { ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/lib/axios";
import { AuthResponse } from "../types";

export const authApi = {
  me: async () => {
    const res = await api.get<AuthResponse>(ENDPOINTS.AUTH.me);
    return res.data;
  },

  logout: async () => {
    const res = await api.post(ENDPOINTS.AUTH.logout);
    return res.data;
  },

  googleSign: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.sign}`;
  },
};
