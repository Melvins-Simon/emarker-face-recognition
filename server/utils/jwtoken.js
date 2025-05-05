export const generateJwtAsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRETE_KEY, {
    expiresIn: "7d",
  });

  res.cookie("authorization", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};
