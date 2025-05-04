import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

axios.defaults.withCredentials = true;
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "https://ms-emarker-euhcbzb9gbf7ejgs.centralus-01.azurewebsites.net/api/auth";
export const useAuthstore = create(
  persist((set) => ({
    user: null,
    error: null,
    message: null,
    isLoading: false,
    isLoading2: false,
    isAuthenticated: false,
    isCheckingAuth: false,
    userID: null,
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
          isAuthenticated: false,
        });
        toast.success(`${response.data.message}-Check Spam!`);
      } catch (error) {
        set({
          error:
            error.response.data.message || "Error sending verification code",
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
          userID: response.data.data._id,
        });
        toast.success(response.data.message);
        return response.data;
      } catch (error) {
        set({ error: error.response.data.message, isLoading2: false });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    signout: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/signout`);
        set({
          isLoading: false,
          message: response.data.message,
          isAuthenticated: false,
          isAuthenticated: false,
          user: null,
          message: null,
          userID: null,
        });

        toast.success(response.data.message);
        localStorage.removeItem("em");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("undefined");
        return response.data.message;
      } catch (error) {
        set({ error: error.response.data.message, isLoading: false });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    signin: async ({ email, password, role }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/signin`, {
          email,
          password,
          role,
        });
        set({
          user: response.data.data,
          isLoading: false,
          isAuthenticated: true,
          message: response.data.message,
          userID: response.data.data._id,
        });
        toast.success(response.data.message);
        return response.data.data;
      } catch (error) {
        set({ error: error.response.data.message, isLoading: false });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    checkAuth: async () => {
      set({ isCheckingAuth: true, error: null });
      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        set({
          user: response.data.user,
          isCheckingAuth: false,
          isAuthenticated: true,
          message: response.data.message,
          userID: response.data.data._id,
        });
        toast.success(response.data.message);
        return response.data.user;
      } catch (error) {
        set({
          error: error.response.data.message,
          isCheckingAuth: false,
          isLoading: false,
        });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    forgot_password: async (email) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/forgot-password`, {
          email,
        });
        set({
          message: response.data.message,
          isLoading: false,
        });
        toast.success(response.data.message);
        return response.data.user;
      } catch (error) {
        set({
          error: error.response.data.message,
          isCheckingAuth: false,
          isLoading: false,
        });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    reset_password: async ({ newPassword, confirmNewPassword, id }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/reset-password/${id}`, {
          newPassword,
          confirmNewPassword,
        });
        set({
          message: response.data.message,
          isLoading: false,
        });
        toast.success(response.data.message);
        return response.data.user;
      } catch (error) {
        set({
          error: error.response.data.message,
          isCheckingAuth: false,
          isLoading: false,
        });
        toast.error(error.response.data.message);
        throw error;
      }
    },
    upload_dataset: async (images) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_URL}/student/upload-face-dataset`,
          {
            images,
          }
        );
        set({
          message: response.data.message,
          isLoading: false,
          urls: response.data.urls,
        });
        toast.success(response.data.message);
        return response.data.user;
      } catch (error) {
        set({
          error: error.response.data.message,
          isCheckingAuth: false,
          isLoading: false,
        });
        toast.error(error.response.data.message);
        throw error;
      }
    },
  }))
);
