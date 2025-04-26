import express from "express";
import checkAuth from "../middlewares/verifyJwt.js";
import { get_images, upload_image } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/student/upload-face-dataset", checkAuth, upload_image);
router.get("/faces", checkAuth, get_images);

export default router;
