import express from "express";
import "dotenv/config";
import conDb from "./db/connDb.js";
import authRouter from "./routers/user.router.js";
import cookieParser from "cookie-parser";

const app = express();

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || `Something went wrong.`;
  return res.status(status).json({ success: false, message: message });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(process.env.PORT || 3000, (next) => {
  conDb(next);
  console.log(`Server running on port ---> ${process.env.PORT || 3000}`);
});

app.use("/api", authRouter);
