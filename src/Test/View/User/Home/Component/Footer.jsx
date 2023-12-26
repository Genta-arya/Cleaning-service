import React, { useRef } from "react";
import logo from "../../../../../Asset/wayan logo.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { faMailBulk, faRoad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailchimp, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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
          <h2 className="text-xl font-bold text-biru">Lokasi :</h2>

          <MapContainer
            center={center}
            zoom={20}
            className="border-2 border-biru rounded-lg z-10 w-full h-80 lg:h-[500px]"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
            <div className="lg:block md:block hidden">
              <img
                src={logo}
                alt="logo"
                className="lg:w-24 lg:h-24 h-16 w-16"
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-8  ">
            <div className="text-center flex items-center ">
              <FontAwesomeIcon icon={faRoad} size="xl" className="mr-2 " />

              <p className="items-center text-left text-sm">
                Jl. Celagi Basur, Jimbaran, Kec. Kuta Sel. Kabupaten
                Badung, Bali 80361
              </p>
            </div>

            <div className="text-center flex items-center hover:underline cursor-pointer"  onClick={openWhatsApp}>
              <FontAwesomeIcon
                icon={faWhatsapp}
                size="xl"
                className="mr-2 hover:underline"
               
              />
              <p className="items-center">+62 877-6268-9648</p>
            </div>

            <div className="text-center flex items-center hover:underline cursor-pointer" onClick={openEmail}>
              <FontAwesomeIcon
                icon={faMailBulk}
                size="xl"
                className="mr-2 hover:underline"
                
              />
              <p className="">wayan@gmail.com</p>
            </div>
          </div>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
