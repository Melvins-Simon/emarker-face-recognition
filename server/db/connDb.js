import mongoose from "mongoose";
import "dotenv/config";

async function conDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected!");
  } catch (err) {
    throw new Error("❌ MongoDB connection failed: " + err.message);
  }
}

export default conDb;
