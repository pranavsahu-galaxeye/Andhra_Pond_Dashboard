import { useEffect, useState } from "react";
import Map, { Source, Layer } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import CircularProgress from "@mui/material/CircularProgress";
import MapGeocoder from "./MapGeocoder";
import Sidebar from "../Sidebar/Sidebar";
import { fetchData } from "./GeoJsonFetcher";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
  subdistrictsLayer,
  subdistrictsLineLayer,
} from "./MapLayers";
import {
  formatArea,
  formatCoordinates,
  adjustCoordinatesToIndia,
} from "./GeoUtils";
import InfoPopup from "./InfoPopup";

const MapComponent = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [subdistrictsData, setSubdistrictsData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [selectedPond, setSelectedPond] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(([subdistricts_data, geojson_data]) => {
        setSubdistrictsData(subdistricts_data);
        setGeojsonData(adjustCoordinatesToIndia(geojson_data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data", error);
        setIsLoading(false);
      });
  }, []);

  const handleMouseEnter = (event) => {
    const feature = event.features[0];
    const [longitude, latitude] = feature.geometry.coordinates;

    if (feature.layer.id === "clusters") {
      setHoverInfo({
        longitude,
        latitude,
        area: formatArea(feature.properties.sum_area) || "N/A",
        isCluster: true,
      });
    } else {
      setHoverInfo({
        longitude,
        latitude,
        state: feature.properties.STATE || "N/A", // Ensure fallback value
        subdistrict: feature.properties.SUBDISTRICT || "N/A", // Ensure fallback value
        district: feature.properties.DISTRICT || "N/A", // Ensure fallback value
        village: feature.properties.VILLAGE || "N/A", // Ensure fallback value
        coordinates: formatCoordinates(longitude, latitude),
        area: formatArea(feature.properties.AREA) || "N/A",
        isCluster: false,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  const handleClick = (event) => {
    const features = event.features;
    if (!features.length) return;

    const feature = features[0];
    const [longitude, latitude] = feature.geometry.coordinates;

    const clusterId = feature.properties.cluster_id;
    const mapSource = event.target.getSource("ponds");

    if (clusterId) {
      mapSource.getClusterExpansionZoom(clusterId).then((zoom) => {
        event.target.easeTo({
          center: feature.geometry.coordinates,
          zoom,
        });
      });
    } else {
      setPopupInfo({
        longitude,
        latitude,
        state: feature.properties.STATE || "N/A",
        subdistrict: feature.properties.SUBDISTRICT || "N/A",
        district: feature.properties.DISTRICT || "N/A",
        village: feature.properties.VILLAGE || "N/A",
        coordinates: formatCoordinates(longitude, latitude),
        area: formatArea(feature.properties.AREA) || "N/A",
      });

      setSelectedPond({
        district: feature.properties.DISTRICT || "N/A",
        subdistrict: feature.properties.SUBDISTRICT || "N/A",
        village: feature.properties.VILLAGE || "N/A",
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
      });
    }
  };

  const handleGoogleMapsRedirect = (longitude, latitude) => {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="flex justify-center items-center fixed inset-0 bg-white/70 z-50">
          <CircularProgress />
        </div>
      )}
      {!isLoading && (
        <Map
          initialViewState={{
            longitude: 80.648,
            latitude: 15.9129,
            zoom: 6,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
            import.meta.env.VITE_MAPTILER_KEY
          }`}
          mapLib={maplibregl}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {subdistrictsData && (
            <Source id="subdistricts" type="geojson" data={subdistrictsData}>
              <Layer {...subdistrictsLayer} />
              <Layer {...subdistrictsLineLayer} />
            </Source>
          )}

          {geojsonData && (
            <Source
              id="ponds"
              type="geojson"
              data={geojsonData}
              cluster={true}
              clusterMaxZoom={14}
              clusterRadius={50}
              clusterProperties={{
                sum_area: ["+", ["get", "AREA"]],
              }}
            >
              <Layer {...clusterLayer} />
              <Layer {...clusterCountLayer} />
              <Layer {...unclusteredPointLayer} />
            </Source>
          )}

          <MapGeocoder />

          {(hoverInfo || popupInfo) && (
            <InfoPopup
              info={hoverInfo || popupInfo}
              onGoogleMapsRedirect={handleGoogleMapsRedirect}
            />
          )}
        </Map>
      )}

      {selectedPond && (
        <Sidebar
          pondInfo={selectedPond}
          closeSidebar={() => setSelectedPond(null)}
        />
      )}
    </div>
  );
};

export default MapComponent;
