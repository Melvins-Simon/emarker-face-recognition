import express from "express";
import checkAuth from "../middlewares/verifyJwt.js";
import { upload_image } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/student/upload-face-dataset", checkAuth, upload_image);

export default router;
