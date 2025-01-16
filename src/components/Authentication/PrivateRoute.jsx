import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? children : <Navigate to="/" />;
};

// PropTypes validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Ensures children are passed and can be any renderable content
};

export default PrivateRoute;
