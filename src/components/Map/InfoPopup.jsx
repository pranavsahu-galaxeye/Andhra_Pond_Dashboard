import PropTypes from "prop-types";
import { Popup } from "react-map-gl";

const InfoPopup = ({ info, onGoogleMapsRedirect }) => {
  return (
    <Popup
      longitude={info.longitude}
      latitude={info.latitude}
      closeButton={false}
      closeOnClick={false}
      anchor="top"
    >
      <div>
        {info.isCluster ? (
          <p>Area: {info.area}</p>
        ) : (
          <div>
            <p>State: {info.state}</p>
            <p>Subdistrict: {info.subdistrict}</p>
            <p>District: {info.district}</p>
            <p>Village: {info.village}</p>
            <p>Coordinates: {info.coordinates}</p>
            <p>Area: {info.area}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition"
              onClick={() =>
                onGoogleMapsRedirect(info.longitude, info.latitude)
              }
            >
              Open in Google Maps
            </button>
          </div>
        )}
      </div>
    </Popup>
  );
};

InfoPopup.propTypes = {
  info: PropTypes.shape({
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    area: PropTypes.string.isRequired,
    state: PropTypes.string, // Optional
    subdistrict: PropTypes.string, // Optional
    district: PropTypes.string, // Optional
    village: PropTypes.string, // Optional
    coordinates: PropTypes.string, // Optional
    isCluster: PropTypes.bool, // Make this optional
  }).isRequired,
  onGoogleMapsRedirect: PropTypes.func.isRequired,
};



export default InfoPopup; // This should be the default export
