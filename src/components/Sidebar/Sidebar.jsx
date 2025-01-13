import React from "react";
import PropTypes from "prop-types";
import { IconButton, Slide, Box, Typography, Collapse } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Sidebar = ({ pondInfo, closeSidebar }) => {
  const [isLocationExpanded, setIsLocationExpanded] = React.useState(true);

  if (!pondInfo) {
    return null;
  }

  const toggleLocationExpand = () => {
    setIsLocationExpanded(!isLocationExpanded);
  };

  return (
    <div className="absolute right-0 top-24 bottom-2 flex items-center w-full max-w-[400px] rounded-lg px-2">
      <IconButton
        aria-label="Close Sidebar"
        onClick={closeSidebar}
        sx={{
          background: "linear-gradient(to right, #e0e0e0, #f5f5f5, #ffffff)",
          color: "black",
          border: "1px solid #d6d6d6",
          "&:hover": {
            background: "#053C3A",
            // borderColor: "#388e3c",
          },
          width: "32px",
          height: "32px",
          transition: "all 0.3s ease",
          marginRight:"4px",
        }}
      >
        <ArrowForwardIosIcon fontSize="medium" />
      </IconButton>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Box
          component="div"
          className="flex flex-col items-center w-full max-w-[600px] p-5 rounded-3xl bg-gradient-to-r from-[#121212] via-[#09302e] to-[#053C3A] text-white relative h-full z-50"
        >
          <Typography variant="h4" className="text-white text-center w-full">
            Questionnaire
          </Typography>
          <div className="mt-4 w-full p-4 rounded-xl bg-black bg-opacity-50 text-white">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={toggleLocationExpand}
            >
              <Typography variant="h6" className="font-extrabold">
                Pond Location
              </Typography>
              {isLocationExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Collapse in={isLocationExpanded} timeout="auto" unmountOnExit>
              <div className="grid grid-cols-2 gap-1 text-left">
                <Typography className="font-semibold">District:</Typography>
                <Typography>{pondInfo.district || "N/A"}</Typography>

                <Typography className="font-semibold">Mandal:</Typography>
                <Typography>{pondInfo.subdistrict || "N/A"}</Typography>

                <Typography className="font-semibold">Village:</Typography>
                <Typography>{pondInfo.village || "N/A"}</Typography>

                <Typography className="font-semibold">Latitude:</Typography>
                <Typography>{pondInfo.latitude || "N/A"}</Typography>

                <Typography className="font-semibold">Longitude:</Typography>
                <Typography>{pondInfo.longitude || "N/A"}</Typography>
              </div>
            </Collapse>
          </div>
        </Box>
      </Slide>
    </div>
  );
};

Sidebar.propTypes = {
  pondInfo: PropTypes.shape({
    district: PropTypes.string,
    subdistrict: PropTypes.string,
    village: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
  }),
  closeSidebar: PropTypes.func,
};

export default Sidebar;
