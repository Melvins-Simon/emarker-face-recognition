import jwt from "jsonwebtoken";
import "dotenv/config";

const checkAuth = (req, res, next) => {
  const authToken = req.cookies.authorization;
  try {
    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, Signature not found.",
      });
    }

    const decoded = jwt.verify(authToken, process.env.SECRETE_KEY);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Unauthorized, invalid signature: ${error}`,
    });
  }
};

export default checkAuth;
