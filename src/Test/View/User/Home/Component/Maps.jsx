import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import marker from "../../../../../Asset/mark.png"
const Maps = ({
  mapKey,
  handleGetCurrentLocation,
  selectedLocation,
  mapVisible,
  MapClickHandler,
  mapdetail,
  referenceCoordinates,
}) => {
  const [locationPermission, setLocationPermission] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [route, setRoute] = useState(null);
  const [yourLocationMarkerRef, setYourLocationMarkerRef] = useState(null);
  const [toastId, setToastId] = useState(null);

  useEffect(() => {
    checkLocationPermission();
    fetchRoute()
  }, []);

  const checkLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission(false);
        }
      );
    } else {
      setLocationPermission(false);
    }
  };

  const getLocation = () => {
    handleGetCurrentLocation();
    if (loadingLocation) {
      return;
    }

    setLoadingLocation(true);

    if (locationPermission === true) {
      handleGetCurrentLocation();
      fetchRoute();
    } else {
      const newToastId = toast.error(
        "Please enable location services to use this feature.",
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => {
            setLoadingLocation(false);
          },
        }
      );
      setToastId(newToastId);
    }
  };

  useEffect(() => {
    if (toastId !== null) {
      return () => toast.dismiss(toastId);
    }
  }, [toastId]);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248a051d454575342b29dc4d8f60ac3efd2&start=${selectedLocation.lng},${selectedLocation.lat}&end=${referenceCoordinates.lng},${referenceCoordinates.lat}`
      );

      if (response.data && response.data.features) {
        setRoute(response.data.features[0].geometry.coordinates);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const routePolyline = route && route.map((coord) => [coord[1], coord[0]]);

  return (
    <div>
      <ToastContainer />

      <div className="mb-4 flex justify-center ">
        <button
          type="button"
          onClick={getLocation}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 mr-2"
        >
          Set your Location
        </button>
      </div>

      {mapVisible && locationPermission !== false && (
        <div className="mb-4 border-2 border-gray-500 rounded-xl p-2">
          <MapContainer
            key={mapKey}
            center={[selectedLocation.lat, selectedLocation.lng]}
            zoom={8}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={
                new L.Icon({
                  iconUrl:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48' fill='blue' stroke='black' stroke-width='2'><circle cx='12' cy='12' r='8'/></svg>",
                  iconSize: [24, 24],
                  iconAnchor: [12, 24],
                  popupAnchor: [0, -24],
                })
              }
              ref={(marker) => {
                if (marker) {
                  setYourLocationMarkerRef(marker);
                }
              }}
            >
              {yourLocationMarkerRef && <Popup>Your Location</Popup>}
            </Marker>

            <Marker
              position={[referenceCoordinates.lat, referenceCoordinates.lng]}
              icon={
                new L.Icon({
                  iconUrl: marker,
                  iconSize: [24, 24],
                  iconAnchor: [12, 24],
                  popupAnchor: [0, -24],
                })
              }
            >
              <Popup>Service Location</Popup>
            </Marker>

            {routePolyline && (
              <Polyline positions={routePolyline} color="blue" />
            )}

          
          </MapContainer>
        </div>
      )}

      {locationPermission === false && (
        <div className="mb-4">
          <p>
            Location services are not enabled. Please enable location services
            to use this feature.
          </p>
        </div>
      )}
      {mapdetail !== 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 flex justify-center">
            {mapdetail}
          </p>
        </div>
      )}
    </div>
  );
};

export default Maps;
