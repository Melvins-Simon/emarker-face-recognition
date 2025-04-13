import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:5000/api/";
export const useGlobalstore = create(
  persist((set) => ({
    isLoading: false,
    error: null,
    url: [],
    upload_image: async (frames, name, email) => {
      try {
        // Keep the full data URI (including the prefix)
        const images = frames.map((f) => f); // Don't split here

        // Add loading state
        set({ isLoading: true, error: null });

        const response = await axios.post(
          `${API_URL}student/upload-face-dataset`,
          { images, name, email },
          {
            headers: {
              "Content-Type": "application/json",
              // Add any auth headers if needed
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        toast.success("Upload successful!");
        set({ url: response.data.data.images, isLoading: false });
        return response.data.data;
      } catch (error) {
        console.error("Upload error:", error);
        set({ error: error.message, isLoading: false });
        toast.error(error.response?.data?.error || "Failed to upload dataset.");
        throw error;
      }
    },
  }))
);
