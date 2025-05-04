import express from "express";
import "dotenv/config";
import conDb from "./db/connDb.js";
import authRouter from "./routers/user.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import imgRouter from "./routers/image.router.js";

const app = express();

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || `Something went wrong.`;
  return res.status(status).json({ success: false, message: message });
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://xenielink.online", "http://localhost:5173"],
    credentials: true,
  })
);

// Routes
app.use("/api", authRouter);
app.use("/api", imgRouter);

// Server
app.listen(process.env.PORT || 3000, (next) => {
  conDb(next);
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}/`
  );
});
