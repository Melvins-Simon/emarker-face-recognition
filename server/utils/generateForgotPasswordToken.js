import crypto from "crypto";
export const genForgotPasswdToken = () => {
  return crypto.randomBytes(20).toString("hex");
};
