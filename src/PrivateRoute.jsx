import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // 🔐 Verifica si hay un token
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
