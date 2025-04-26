import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, Notauthorized, Notfound } from "./pages";
import { Authlayout, Dashlayout, Infolayout } from "./layouts";
import {
  Admindash,
  Admininfo,
  Emailsignin,
  Emailsignup,
  Forgotpassword,
  Googlesignin,
  Lecturerdash,
  Lecturerinfo,
  Reset,
  Resetpassword,
  Signin,
  Signup,
  Ssoauth,
  Studentdash,
  Studentinfo,
} from "./components";

import ProtectedRoute from "./components/Routeguard";
import { useAuthstore } from "./store/Authstore";
import FaceRecognition from "./components/Session";
const App = () => {
  const { isAuthenticated, user } = useAuthstore();
  return (
    <Routes>
      <Route element={<Home />} path="/" exact />
      {!isAuthenticated && (
        <Route element={<Authlayout />}>
          <Route element={<Signup />} path="/auth/sign-up" />
          <Route element={<Emailsignup />} path="/auth/sign-up/email" />
          <Route element={<Signin />} path="/auth/sign-in" />
          <Route element={<Emailsignin />} path="/auth/sign-in/email" />
          <Route
            element={<Googlesignin />}
            path="/auth/sign-in/google/:fbURL"
          />
          <Route element={<Ssoauth />} path="/auth/sign-up/sso" />
          <Route element={<Forgotpassword />} path="/auth/forgot-password" />
          <Route element={<Reset />} path="/auth/forgot-password/reset" />
          <Route element={<Resetpassword />} path="/auth/reset-password/:id" />
        </Route>
      )}
      {/* Guarded Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Dashlayout />
          </ProtectedRoute>
        }
      >
        <Route element={<Navigate to={"/z"} replace />} path="/auth/sign-up" />
        <Route
          element={<Navigate to={"/z"} replace />}
          path="/auth/sign-up/email"
        />
        <Route element={<Navigate to={"/z"} replace />} path="/auth/sign-in" />
        <Route
          element={<Navigate to={"/z"} replace />}
          path="/auth/sign-in/email"
        />
        <Route
          element={<Navigate to={"/z"} replace />}
          path="/auth/sign-in/google/:fbURL"
        />
        <Route
          element={<Navigate to={"/z"} replace />}
          path="/auth/sign-up/sso"
        />

        {/* Defaults */}
        {user?.role === "admin" ? (
          <Route
            element={<Navigate to={`/dash/admin/${user?._id}`} replace />}
            path="/z"
          />
        ) : user?.role === "student" ? (
          <Route
            element={<Navigate to={`/dash/student/${user?._id}`} replace />}
            path="/z"
          />
        ) : user?.role === "lecturer" ? (
          <Route
            element={<Navigate to={`/dash/lecturer/${user?._id}`} replace />}
            path="/z"
          />
        ) : null}

        {/* Routes */}
        <Route element={<Admindash />} path={`/dash/admin/${user?._id}`} />
        <Route element={<Studentdash />} path={`/dash/student/${user?._id}`} />
        <Route
          element={<Lecturerdash />}
          path={`/dash/lecturer/${user?._id}`}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Infolayout />
          </ProtectedRoute>
        }
      >
        <Route element={<Studentinfo />} path="/student/info/:id" />
        <Route element={<Lecturerinfo />} path="/lecturer/info/:id" />
        <Route element={<Admininfo />} path="/admin/info/:id" />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <FaceRecognition />
          </ProtectedRoute>
        }
        path={`/face-recognition/session/${user?.id}`}
      />
      <Route element={<Notfound />} path="*" />
      <Route element={<Notauthorized />} path="/not-authorized" />
    </Routes>
  );
};

export default App;
