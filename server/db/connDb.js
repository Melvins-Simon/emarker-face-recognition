import mongoose from "mongoose";
import "dotenv/config";

async function conDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection success.");
  } catch (err) {
    throw new Error(`Problem connecting to database -->${err.message}`);
  }
}

export default conDb;
