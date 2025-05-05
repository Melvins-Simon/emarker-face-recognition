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
router.post("/auth/signout", signout);
router.get("/auth/check-auth", getUser);
router.delete("/auth/delete/user/:id", delUser);

// DASHBOARD
router.get("/dash/get-users", get_all_users);
router.post("/dash/add-course", add_course);
router.get("/lectures", get_courses);
router.delete("/delete-course/:courseId", deleteCourseById);
router.post("/mark-attendance", markAttendance);

export default router;
// removed jwt verfication for project purpose
