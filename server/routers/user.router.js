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
} from "../controllers/user.controller.js";
import checkAuth from "../middlewares/verifyJwt.js";

const router = express.Router();

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

export default router;
