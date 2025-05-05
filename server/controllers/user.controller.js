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

// AUTHENTICATION

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
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all the required details." });
    }

    const userExist = await User.findOne({ email, role }).select("+password");

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User with the provided details not found.",
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
      .json({ success: false, message: "Password reset was successful." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error -> ${error.message}`,
    });
  }
};

//Delete User
export const delUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
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
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, invalid or expired signature.",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, invalid or expired signature.",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "Authenticated", user: user._doc });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ---> ${error.message}`,
    });
  }
};

// DASHBOARD

export const get_all_users = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized, invalid or expired signature.",
      });
    }

    // Get all non-admin users with counts
    const [users, counts] = await Promise.all([
      User.find(
        { role: { $ne: "admin" } },
        { password: 0, __v: 0 } // Exclude sensitive fields
      ).lean(),

      // Get counts of lecturers and students
      User.aggregate([
        {
          $match: {
            role: { $ne: "admin" }, // Exclude admins from counts too
          },
        },
        {
          $group: {
            _id: null,
            lecturers: {
              $sum: { $cond: [{ $eq: ["$role", "lecturer"] }, 1, 0] },
            },
            students: {
              $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
            },
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const processedUsers = users.map((user) => {
      const userObj = { ...user };
      if (user.role === "student" || user.role === "lecturer") {
        delete userObj.images;
      }
      return userObj;
    });

    const stats = counts[0] || { lecturers: 0, students: 0, total: 0 };

    res.status(200).json({
      success: true,
      users: processedUsers,
      stats: {
        lecturers: stats.lecturers,
        students: stats.students,
        total: stats.total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error ---> ${error.message}`,
    });
  }
};

export const add_course = async (req, res) => {
  try {
    const { code, name, lectureId } = req.body;

    if (!code || !name || !lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all required details!" });
    }

    const lecture = await User.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    lecture.courses.push({
      code,
      name,
      lecturer: lecture.username,
      studentsEnrolled: 0,
    });

    const courses = await lecture.save();

    res.status(200).json({
      message: "Course added successfully",
      lecture: courses._doc.courses,
    });
  } catch (error) {
    console.error("Error adding course to lecture:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const get_courses = async (req, res) => {
  try {
    const lecturers = await User.find({ role: "lecturer" })
      .select("_id username courses")
      .lean();

    // Combine all courses into one array with lecturer info
    const allCourses = lecturers.flatMap((lecturer) =>
      lecturer.courses.map((course) => ({
        ...course,
        lecturerId: lecturer._id,
        lecturerName: lecturer.username,
      }))
    );

    res.status(200).json({
      success: true,
      lecturers: allCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const deleteCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Delete the course from all lecturers
    const deleteResult = await User.updateMany(
      { "courses._id": courseId },
      { $pull: { courses: { _id: courseId } } }
    );

    if (deleteResult.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found in any lecturer's courses",
      });
    }

    // 2. Get all lecturers with their updated courses
    const lecturers = await User.find({ role: "lecturer" })
      .select("_id username courses")
      .lean();

    // 3. Format the response
    const response = {
      success: true,
      message: `Course ${courseId} deleted successfully from ${deleteResult.modifiedCount} lecturer(s)`,
      data: lecturers.map((lecturer) => ({
        lecturerId: lecturer._id,

        courses: lecturer.courses.map((course) => ({
          id: course._id,
          code: course.code,
          name: course.name,
          studentsEnrolled: course.studentsEnrolled,
          lecturer: lecturer.username,
        })),
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    // 1. Validate required fields
    if (!courseId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "courseId and studentId are required",
      });
    }

    // 2. Find the student
    const student = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("username email");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 3. Find the lecturer and course
    const lecturer = await User.findOne({
      role: "lecturer",
      "courses._id": courseId,
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        message: "Course not found under any lecturer",
      });
    }

    const course = lecturer.courses.id(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course subdocument not found",
      });
    }

    // 4. Check for existing attendance using EMAIL (new validation)
    const today = new Date().toDateString();
    const alreadyMarked = course.attendance.some(
      (record) =>
        record.studentEmail === student.email && // Check by email
        new Date(record.date).toDateString() === today
    );

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this student's email today",
      });
    }

    // 5. Add new attendance
    const newAttendance = {
      studentId,
      studentName: student.username,
      studentEmail: student.email,
      date: new Date(),
      status: "present",
    };

    course.attendance.push(newAttendance);

    // 6. Update studentsEnrolled (count unique emails)
    const uniqueStudents = new Set(
      course.attendance.map((record) => record.studentEmail) // Track by email
    );
    course.studentsEnrolled = uniqueStudents.size;

    await lecturer.save();

    // 7. Return response
    const createdAttendance = course.attendance[course.attendance.length - 1];

    res.status(201).json({
      success: true,
      data: {
        attendance: {
          id: createdAttendance._id,
          studentId: createdAttendance.studentId,
          studentName: createdAttendance.studentName,
          studentEmail: createdAttendance.studentEmail,
          date: createdAttendance.date,
          status: createdAttendance.status,
        },
        courseStats: {
          studentsEnrolled: course.studentsEnrolled,
          totalAttendanceRecords: course.attendance.length,
        },
      },
    });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
