import React, { useRef } from "react";
import logo from "../../../../../Asset/wayan logo.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { faMailBulk, faRoad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const customIcon = new L.divIcon({
  className: "custom-marker-icon",
  html: `<img class="w-8 h-8" src="https://img.icons8.com/color/48/marker--v1.png" alt="marker--v1"/>`,
});

const Footer = () => {
  const mapRef = useRef();
  const center = [-8.785888, 115.172469];

  const openInMaps = () => {
    window.open(`https://www.google.com/maps/place/${center[0]},${center[1]}`);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/6287762689648");
  };

  const openEmail = () => {
    window.location.href = "mailto:waya@gmail.com";
  };

  return (
    <div className="flex justify-center">
      <footer className="footer p-10 bg-base-200 text-base-content lg:flex md:flex">
        <div className="text-center mb-4 w-full">
          <h2 className="text-xl font-bold text-biru">
            Lokasi : 
          </h2>

          <MapContainer
            center={center}
            zoom={20}
            style={{ width: "100%", height: "500px" }}
            className="border-2 border-biru rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             
            />
            <Marker position={center} icon={customIcon} ref={mapRef}>
              <Popup>
                <button onClick={openInMaps}>Wayan Service</button>
                <br />
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <aside>
          <div className="flex flex-col items-center">
            <div className="lg:ml-32">
              <img
                src={logo}
                alt="logo"
                className="lg:w-24 lg:h-24 h-16 w-16"
              />
            </div>
           
          </div>

          <div className="flex flex-col items-start gap-4 ">
            <p className="text-center">
              <FontAwesomeIcon icon={faRoad} size="xl" className="mr-2" />
              Jl. Celagi Basur, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali
              80361
            </p>
            <p className="text-center">
              <FontAwesomeIcon icon={faWhatsapp} size="xl" className="mr-2" />
              <button onClick={openWhatsApp} className="hover:underline">+62 877-6268-9648</button>
            </p>
            <p className="text-center">
              <FontAwesomeIcon icon={faMailBulk} size="xl" className="mr-2" />
              <button onClick={openEmail} className="hover:underline">waya@gmail.com</button>
            </p>
          </div>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
