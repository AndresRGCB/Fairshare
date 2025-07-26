import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: "GET",
        headers: {
                "Authorization": `Bearer ${token}`, // ✅ Add 'Bearer ' before token
            },
        });
          

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token"); // Remove invalid token
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>; // Show loading while verifying

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
