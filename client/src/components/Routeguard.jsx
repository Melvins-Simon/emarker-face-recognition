import { Navigate } from "react-router-dom";
import { useAuthstore } from "../store/Authstore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthstore();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={"/auth/sign-in/email"} replace />
  );
};

export default ProtectedRoute;
