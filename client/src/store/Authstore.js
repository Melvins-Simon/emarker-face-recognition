import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api/auth";
export const useAuthstore = create((set) => ({
  user: null,
  error: null,
  message: null,
  isLoading: false,
  isLoading2: false,
  isAuthenticated: false,
  isCheckingAuth: false,
  signup: async ({ username, email, password, confirmPassword, role }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        email,
        password,
        confirmPassword,
        role,
      });
      set({
        isLoading: false,
        message: response.data.message,
      });
      toast.success(response.data.message);
    } catch (error) {
      set({
        error: error.response.data.message || "Error sending verification code",
        isLoading: false,
      });
      toast.error(error.response.data.message);
      throw error;
    }
  },
  verifyEmail: async (verificationCode) => {
    set({ isLoading2: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        verificationCode,
      });
      set({
        user: response.data.data,
        isLoading2: false,
        message: response.data.message,
        isAuthenticated: true,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      set({ error: error.response.data.message, isLoading2: false });
      toast.error(error.response.data.message);
      throw error;
    }
  },
}));
