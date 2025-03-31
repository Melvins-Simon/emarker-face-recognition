import bcrypt from "bcryptjs";

export const hashPasswd = async (password, salt) => {
  return await bcrypt.hash(password, salt || 12);
};

export const comparePasswd = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};
