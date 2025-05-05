import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import conDb from "./db/connDb.js";
import authRouter from "./routers/user.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import imgRouter from "./routers/image.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://emarker-face-recognition.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", authRouter);
app.use("/api", imgRouter);

// Serve HTML for base URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || `Something went wrong.`;
  return res.status(status).json({ success: false, message: message });
});

// Server
app.listen(process.env.PORT || 3000, (next) => {
  conDb(next);
  console.log(
    `🚀 Server running on  http://localhost:${process.env.PORT || 3000}/`
  );
});
