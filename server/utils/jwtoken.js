import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateJwtAsetCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.SECRETE_KEY, {
      expiresIn: "7d",
    });
    res.cookie("authorization", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};
