import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

const Maps = ({
  mapKey,
  handleGetCurrentLocation,
  selectedLocation,
  mapVisible,
  MapClickHandler,
  mapdetail,
}) => {
  const [locationPermission, setLocationPermission] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [toastId, setToastId] = useState(null);

  console.log(mapdetail)

  useEffect(() => {
    checkLocationPermission();
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
            zoom={20}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={
                new Icon({
                  iconUrl:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48' fill='red' stroke='black' stroke-width='2'><circle cx='12' cy='12' r='8'/></svg>",
                  iconSize: [24, 24],
                  iconAnchor: [24, 48],
                  popupAnchor: [0, -48],
                })
              }
            >
              <Popup>Your Location</Popup>
            </Marker>

            <MapClickHandler />
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
            <p className="text-xs text-gray-500 flex justify-center">{mapdetail}</p>
        </div>
      )}
    </div>
  );
};

export default Maps;
