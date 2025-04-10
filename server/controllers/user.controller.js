import { User } from "../models/user.model.js";
import {
  sendResetLink,
  sendResetSuccess,
  sendVerificationCode,
  sendWelcomeEmail,
} from "../utils/emails.js";
import { genForgotPasswdToken } from "../utils/generateForgotPasswordToken.js";
import { genVCode } from "../utils/genVC.js";
import { comparePasswd, hashPasswd } from "../utils/hashing.js";
import { generateJwtAsetCookie } from "../utils/jwtoken.js";
import { splitName } from "../utils/returnFName.js";

// signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;
    if (!username || !email || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all required details." });
    }
    const userExist = await User.findOne({ email });

    if (userExist && userExist.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User with the same email already exist.",
      });
    } else if (userExist && !userExist.isVerified) {
      const newVCode = genVCode();
      const newExpTime = Date.now() + 30 * 60 * 1000;
      userExist.verificationCode = newVCode;
      userExist.verificationCodeExpTime = newExpTime;
      const user = await userExist.save();

      sendVerificationCode(
        user.verificationCode,
        user.email,
        splitName(user.username)
      );
      return res.status(200).json({
        success: true,
        message: "New verification code sent.",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password mismatch.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least six characters.",
      });
    }
    const hashedPasswd = await hashPasswd(password, 12);
    const verificationCode = genVCode();
    const verificationCodeExpTime = Date.now() + 1000 * 60 * 30;

    const newUser = new User({
      username,
      email,
      password: hashedPasswd,
      verificationCode,
      verificationCodeExpTime,
      role,
    });
    const user = await newUser.save();
    sendVerificationCode(verificationCode, email, splitName(user.username));
    res.status(201).json({
      success: true,
      message: "Verification code sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all the required details." });
    }

    const userExist = await User.findOne({ email }).select("+password");

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User with the provided email not found.",
      });
    }
    const passwordMatched = await comparePasswd(password, userExist.password);
    if (!passwordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password. Try Again." });
    }
    generateJwtAsetCookie(userExist._id, res);
    res.status(200).json({
      success: true,
      message: "Sign in success.",
      data: { ...userExist._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// signout
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("authorization");
    res.status(200).json({ success: true, message: "Logging out success." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// Verify email
export const verifyEmail = async (req, res, next) => {
  const { verificationCode } = req.body;
  try {
    if (!verificationCode) {
      return res
        .status(400)
        .json({ success: false, message: "Verification code is required." });
    }
    if (verificationCode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid verification code.",
      });
    }
    const verifyUser = await User.findOne({
      verificationCode,
      verificationCodeExpTime: { $gt: Date.now() },
    }).select("+verificationCode");

    if (!verifyUser) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired verification code, please check and try again.",
      });
    }
    verifyUser.isVerified = true;
    verifyUser.verificationCode = undefined;
    verifyUser.verificationCodeExpTime = undefined;
    const user = await verifyUser.save();
    generateJwtAsetCookie(user._id, res);
    sendWelcomeEmail(splitName(user.username), user.email);
    res.status(200).json({
      success: true,
      message: "User registration and verification success.",
      data: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// Forgot password
export const forgotPasswd = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email }).select(
      "+forgotPasswdToken"
    );
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User with the email provided not found.",
      });
    }
    const forgotPasswdToken = genForgotPasswdToken();
    const forgotPasswdTokenExpTime = Date.now() + 30 * 60 * 1000;
    userExist.forgotPasswdToken = forgotPasswdToken;
    userExist.forgotPasswdTokenExpTime = forgotPasswdTokenExpTime;
    const user = await userExist.save();
    sendResetLink(
      splitName(userExist.username),
      user.email,
      user.forgotPasswdToken
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to email successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

// Reset password
export const resetPasswd = async (req, res, next) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const { id } = req.params;
    if (!newPassword || !confirmNewPassword || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all the required details." });
    }
    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password length should be at least six characters.",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ success: false, message: `There's a password mismatch` });
    }
    const userExist = await User.findOne({
      forgotPasswdToken: id,
      forgotPasswdTokenExpTime: { $gt: Date.now() },
    })
      .select("+forgotPasswdToken")
      .select("+password");

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "Invalid or exipired verification link.",
      });
    }
    userExist.password = await hashPasswd(newPassword, 12);
    userExist.forgotPasswdToken = undefined;
    userExist.forgotPasswdTokenExpTime = undefined;
    const user = await userExist.save();
    sendResetSuccess(splitName(userExist.username), user.email);
    res
      .status(200)
      .json({ success: false, message: "Email reset was successful." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

//Delete User
export const delUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with the id provide not found.",
      });
    }
    res.status(200).json({ success: true, message: "User deletion success." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ---> ${error.message}`,
    });
  }
};

//return user
export const getUser = async (req, res) => {
  const userId = req.cookies;
  try {
  } catch (error) {}
};
