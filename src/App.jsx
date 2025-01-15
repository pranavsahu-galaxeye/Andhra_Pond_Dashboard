import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Map from "./components/Map/MapComponent";
import Sidebar from "./components/Sidebar/Sidebar";
import SignIn from "./components/SignIn/SignIn";
import {
  AuthProvider,
  AuthContext,
} from "./components/Authentication/AuthContext";
import logo from "../public/Images/galaxeye-white.png";

const App = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    const fetchGeojson = async () => {
      try {
        const response = await fetch("/Geojson/ap_wg_ponds_v14_2.geojson");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch GeoJSON data: ${response.statusText}`
          );
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };

    fetchGeojson();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  component={Dashboard}
                  geojsonData={geojsonData}
                />
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

const Dashboard = ({ geojsonData }) => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="absolute top-2 inset-x-3 flex items-center px-3 py-2.5 bg-gradient-to-r from-[#121212] via-[#09302e] to-[#053C3A] rounded-2xl shadow-lg z-50">
        <img src={logo} alt="Company Logo" className="h-14" />
        {/* <div className="text-white font-bold text-lg text-center"> */}
          {/* <h1 className="animate-pulse">Dashboard</h1> */}
        {/* </div> */}
        <button
          className="ml-auto text-white bg-teal-600 hover:bg-teal-700 rounded-lg px-4 py-2 shadow-md transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="flex flex-1 relative overflow-hidden">
        <Map />
        <Sidebar geojsonData={geojsonData} />
      </div>
    </>
  );
};

Dashboard.propTypes = {
  geojsonData: PropTypes.object, // Add prop validation for geojsonData
};

const ProtectedRoute = ({ component: Component, geojsonData, ...rest }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Component geojsonData={geojsonData} {...rest} />
  ) : (
    <SignIn />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired, // Validate `component`
  geojsonData: PropTypes.object, // Add validation for `geojsonData`
};

export default App;
