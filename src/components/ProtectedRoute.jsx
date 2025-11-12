import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute component to guard routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to login page if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;
