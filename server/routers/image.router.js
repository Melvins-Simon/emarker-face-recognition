import express from "express";
import checkAuth from "../middlewares/verifyJwt.js";
import { get_images, upload_image } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/student/upload-face-dataset", upload_image);
router.get("/faces", get_images);

export default router;

// removed jwt verfication for project purpose
