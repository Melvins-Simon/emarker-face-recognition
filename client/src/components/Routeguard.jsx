import { Navigate, useLocation } from "react-router-dom";
import { useAuthstore } from "../store/Authstore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthstore();
  const location = useLocation();

  // 1. Define which routes require authentication
  const authRequiredRoutes = [
    "/dash/admin/*", // All admin subroutes
  ];

  // 2. Check if current route requires auth
  const routeRequiresAuth = authRequiredRoutes.some((route) =>
    location.pathname.startsWith(route.replace("/*", ""))
  );

  // 3. Show loading state while checking auth status
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-black">
        <div className="font-semibold text-white">Loading...</div>
      </div>
    );
  }

  // 4. Only protect routes that require auth
  if (routeRequiresAuth && !isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // 5. Allow access to all other routes
  return children;
};

export default ProtectedRoute;
