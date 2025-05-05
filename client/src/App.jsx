import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home, Notauthorized, Notfound } from "./pages";
import { Authlayout, Dashlayout, Infolayout } from "./layouts";
import {
  Admindash,
  Emailsignin,
  Emailsignup,
  Forgotpassword,
  Googlesignin,
  Lecturerdash,
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
import GradientLoader, { PageLoader } from "./components/Loader";
import EMarkerAPIServer from "./components/APIDOCS";

const App = () => {
  const { isAuthenticated, user } = useAuthstore();

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate auth check completion
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Home />} path="/" exact />

      {/* Auth Routes (only accessible when not authenticated) */}
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

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Dashlayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect auth paths away from dashboard */}
        <Route element={<Navigate to="/z" replace />} path="/auth/sign-up" />
        <Route
          element={<Navigate to="/z" replace />}
          path="/auth/sign-up/email"
        />
        <Route element={<Navigate to="/z" replace />} path="/auth/sign-in" />
        <Route
          element={<Navigate to="/z" replace />}
          path="/auth/sign-in/email"
        />
        <Route
          element={<Navigate to="/z" replace />}
          path="/auth/sign-in/google/:fbURL"
        />
        <Route
          element={<Navigate to="/z" replace />}
          path="/auth/sign-up/sso"
        />

        {/* Role-based default redirect */}
        {isAuthenticated && (
          <>
            {user?.role === "admin" && (
              <Route
                element={<Navigate to={`/dash/admin/${user._id}`} replace />}
                path="/z"
              />
            )}
            {user?.role === "student" && (
              <Route
                element={<Navigate to={`/dash/student/${user._id}`} replace />}
                path="/z"
              />
            )}
            {user?.role === "lecturer" && (
              <Route
                element={<Navigate to={`/dash/lecturer/${user._id}`} replace />}
                path="/z"
              />
            )}
          </>
        )}

        {/* Dashboard Routes */}
        <Route element={<Admindash />} path="/dash/admin/:id" />
        <Route element={<Studentdash />} path="/dash/student/:id" />
        <Route element={<Lecturerdash />} path="/dash/lecturer/:id" />
      </Route>

      {/* Other Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Infolayout />
          </ProtectedRoute>
        }
      >
        <Route element={<Studentinfo />} path="/student/info/:id" />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <FaceRecognition />
          </ProtectedRoute>
        }
        path="/face-recognition/session/:id"
      />

      {/* Error Routes */}
      <Route element={<Notauthorized />} path="/not-authorized" />
      <Route element={<EMarkerAPIServer />} path="/emarker-api-doc" />
      <Route element={<Notfound />} path="*" />
    </Routes>
  );
};

export default App;
