import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateJwtAsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRETE_KEY, {
    expiresIn: "7d",
  });

  res.cookie("authorization", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    domain: "ms-emarker-euhcbzb9gbf7ejgs.centralus-01.azurewebsites.net",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
