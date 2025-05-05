import express from "express";
import {
  signup,
  resetPasswd,
  signin,
  signout,
  verifyEmail,
  forgotPasswd,
  delUser,
  getUser,
  get_all_users,
  add_course,
  get_courses,
  deleteCourseById,
  markAttendance,
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/verifyJwt.js";

const router = express.Router();

// AUTHS

//Unrestricted routes
router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/verify-email", verifyEmail);
router.post("/auth/forgot-password", forgotPasswd);
router.post("/auth/reset-password/:id", resetPasswd);
//Restricted routes
router.post("/auth/signout", checkAuth, signout);
router.get("/auth/check-auth", checkAuth, getUser);
router.delete("/auth/delete/user/:id", checkAuth, delUser);

// DASHBOARD
router.get("/dash/get-users", checkAuth, get_all_users);
router.post("/dash/add-course", checkAuth, add_course);
router.get("/lectures", checkAuth, get_courses);
router.delete("/delete-course/:courseId", checkAuth, deleteCourseById);
router.post("/mark-attendance", checkAuth, markAttendance);

export default router;
