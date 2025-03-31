import {
  SEND_PASSWD_RESETLINK,
  SEND_RESET_PASSWORDSUCCESS,
  SEND_VERIFICATION_CODE,
  SEND_WELCOME_MAIL,
} from "../middlewares/nodemailer/emailTemplates.js";
import "dotenv/config";
import { transporter } from "../middlewares/nodemailer/nodemailer.js";
import ejs from "ejs";

export const sendVerificationCode = async (code, email, username) => {
  const msgBody = ejs.render(SEND_VERIFICATION_CODE, {
    name: username,
    verificationcode: code,
  });
  transporter.sendMail(
    {
      to: email,
      subject: "Verify your Email",
      html: msgBody,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
};

export const sendWelcomeEmail = async (username, email) => {
  const msBody = ejs.render(SEND_WELCOME_MAIL, { name: username });
  transporter.sendMail(
    {
      to: email,
      subject: "Welcome on Board.",
      html: msBody,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.info("Email sent:", info.response);
      }
    }
  );
};

export const sendResetLink = async (username, email, token) => {
  const msgBody = ejs.render(SEND_PASSWD_RESETLINK, {
    name: username,
    resetLink: `${process.env.RESET_PASSWORD_LINK}${token}`,
  });

  transporter.sendMail(
    {
      to: email,
      subject: "Reset your account password",
      html: msgBody,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.info("Email sent: ", info.response);
      }
    }
  );
};

export const sendResetSuccess = async (username, email) => {
  const msgBody = ejs.render(SEND_RESET_PASSWORDSUCCESS, {
    name: username,
  });

  transporter.sendMail(
    {
      to: email,
      subject: "Password Reset Success.",
      html: msgBody,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.info("Email sent: ", info.response);
      }
    }
  );
};
