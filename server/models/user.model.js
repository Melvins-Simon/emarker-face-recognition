import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Provide username."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Provide username."],
      unique: [true, "Email should be unique."],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Provide password."],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Provide is null."],
    },
    images: {
      type: [String],
    },
    courses: [
      {
        code: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        lecturer: {
          type: String,
          required: true,
        },
        studentsEnrolled: {
          type: Number,
          required: true,
          default: 0,
        },
        attendance: [
          {
            studentName: {
              type: String,
            },
            studentEmail: {
              type: String,
            },
            date: {
              type: Date,
              default: Date.now,
            },
            status: {
              type: String,
              enum: ["present", "absent"],
            },
          },
        ],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeExpTime: {
      type: Date,
    },
    forgotPasswdToken: {
      type: String,
      select: false,
    },
    forgotPasswdTokenExpTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
