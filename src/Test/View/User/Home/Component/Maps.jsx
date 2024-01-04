import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import marker from "../../../../../Asset/mark.png";

const Maps = ({
  mapKey,

  selectedLocation,
  mapVisible,
  routePolyline,
  distance,
  mapdetail,
  referenceCoordinates,
  locationPermission,
}) => {
  const [yourLocationMarkerRef, setYourLocationMarkerRef] = useState(null);



  return (
    <div className="">
      <ToastContainer />

      {mapVisible && locationPermission !== false && (
        <>
          <div className="flex flex-col justify-center">
            <div className="flex justify-center">
              <h1 className="text-xs mb-2 text-orange-500 text-center">
                * Pastikan Lokasimu berada maksimal 25 km dari lokasi service *
              </h1>
            </div>

            <div className="flex justify-center items-center text-ellipsis ">
              <div>
                <h1
                  className={`text-xs items-center text-center font-bold mb-2 ${
                    distance <= 25 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Jarak: {distance} km
                </h1>
              </div>
            </div>
          </div>

          <div className="mb-4 border-2 border-gray-500 rounded-xl p-2 ">
            <MapContainer
              key={mapKey}
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={8}
              style={{ height: "300px", width: "100%" }}
              className="-z-0"
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
                {yourLocationMarkerRef && <Popup>Lokasi kamu</Popup>}
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
                <Popup>Lokasi Service</Popup>
              </Marker>

              {routePolyline && (
                <Polyline positions={routePolyline} color="blue" />
              )}
            </MapContainer>
          </div>
        </>
      )}

      {locationPermission === false && (
        <div className="mb-4">
          <p className="text-red-500 flex justify-center">
            Lokasimu tidak aktif, tolong aktifkan lokasimu untuk melanjutkan
            pesanan ya.
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
