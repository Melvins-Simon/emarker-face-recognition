import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Notfound } from "./pages";
import { Authlayout, Dashlayout, Infolayout } from "./layouts";
import {
  Admindash,
  Emailsignin,
  Emailsignup,
  Forgotpassword,
  Googlesignin,
  Reset,
  Resetpassword,
  Signin,
  Signup,
  Ssoauth,
} from "./components";
import { useAuthstore } from "./store/Authstore";
import ProtectedRoute from "./components/Routeguard";
const App = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthstore();
  return (
    <Routes>
      <Route element={<Home />} path="/" exact />
      <Route element={<Authlayout />}>
        <Route element={<Signup />} path="/auth/sign-up" />
        <Route element={<Emailsignup />} path="/auth/sign-up/email" />
        <Route element={<Signin />} path="/auth/sign-in" />
        <Route element={<Emailsignin />} path="/auth/sign-in/email" />
        <Route element={<Googlesignin />} path="/auth/sign-in/google/:fbURL" />
        <Route element={<Forgotpassword />} path="/auth/forgot-password" />
        <Route element={<Reset />} path="/auth/forgot-password/reset" />
        <Route element={<Resetpassword />} path="/auth/reset-password/:id" />
        <Route element={<Ssoauth />} path="/auth/sign-up/sso" />
      </Route>

      {/* protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Dashlayout />
          </ProtectedRoute>
        }
      >
        <Route element={<Admindash />} path="/dash/admin/:id" />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Infolayout />
          </ProtectedRoute>
        }
      ></Route>
      <Route element={<Notfound />} path="*" />
    </Routes>
  );
};

export default App;
