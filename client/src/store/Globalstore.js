import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

axios.defaults.withCredentials = true;
const API_URL =
  "https://emarker-webapp-c9bthufna7ghagh6.eastus-01.azurewebsites.net/api/";
export const useGlobalstore = create(
  persist((set) => ({
    isLoading: false,
    error: null,
    all_users: null,
    lecs: null,
    stats: null,
    url: [],
    upload_image: async (frames, name, email) => {
      try {
        const images = frames.map((f) => f);

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
    get_all_users: async () => {
      set({ error: null, isLoading: false });
      try {
        set({ isLoading: true });
        const response = await axios.get(`${API_URL}dash/get-users`);
        toast.success("Welcome Admin!");
        set({
          all_users: response.data.users,
          isLoading: false,
          stats: response.data.stats,
        });
        return [response.data.users, response.data.stats];
      } catch (error) {
        set({ error: error.message, isLoading: false });
        toast.error(error.response?.data?.error || "Failed to fetch users.");
        throw error;
      }
    },
    add_course: async (code, name, lectureId) => {
      set({ error: null, isLoading: false });
      try {
        set({ isLoading: true });
        const response = await axios.post(`${API_URL}dash/add-course`, {
          code,
          name,
          lectureId,
        });
        toast.success("Course added successfully!");
        set({
          isLoading: false,
        });
        return response.data.lecture;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        toast.error(error.response?.data?.error || "Failed to add course.");
        throw error;
      }
    },
    get_courses: async () => {
      set({ error: null, isLoading: false });
      try {
        set({ isLoading: true });
        const response = await axios.get(`${API_URL}lectures`);
        set({
          lecs: response.data.lecturers,
          isLoading: false,
        });

        return response.data.lecturers;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        toast.error(error.response?.data?.error || "Failed to add course.");
        throw error;
      }
    },
    delete_course: async (courseId) => {
      set({ error: null, isLoading: false });
      try {
        set({ isLoading: true });
        const response = await axios.delete(
          `${API_URL}delete-course/${courseId}`
        );

        // Extract and flatten all courses from all lecturers
        const allCourses = response.data.data.flatMap((lecturer) =>
          lecturer.courses.map((course) => ({
            ...course,
            lecturerId: lecturer.lecturerId,
            lecturerName: lecturer.username,
          }))
        );

        set({
          courses: allCourses, // Now contains all courses from all lecturers
          isLoading: false,
        });

        return allCourses;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        toast.error(error.response?.data?.error || "Failed to delete course.");
        throw error;
      }
    },
    mark_attendance: async (courseID, studentID) => {
      console.log("from", courseID, studentID);

      set({ error: null, isLoading: false });
      try {
        set({ isLoading: true });
        const response = await axios.post(`${API_URL}mark-attendance`, {
          courseId: courseID,
          studentId: studentID,
        });

        if (response.data.success) {
          return true;
        }
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },
  }))
);
