import React, { useRef } from "react";
import logo from "../../../../../Asset/wayan logo.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { faMailBulk, faRoad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailchimp, faWhatsapp } from "@fortawesome/free-brands-svg-icons";



const Footer = () => {


  const openWhatsApp = () => {
    window.open("https://wa.me/6287762689648");
  };

  const openEmail = () => {
    window.location.href = "mailto:waya@gmail.com";
  };

  return (
    <div className="">
      <footer className="footer p-10 bg-white text-base-content lg:flex md:flex lg:justify-center gap-0 lg:-space-x-32">
        <div className="text-center mb-4 w-full">
          <h2 className="text-xl font-bold text-biru">Lokasi :</h2>

          {/* <MapContainer
            center={center}
            zoom={20}
            className="border-2 border-biru rounded-lg z-10 w-full h-80 lg:h-[500px]"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={center} icon={customIcon} ref={mapRef}>
              <Popup>
                <button onClick={openInMaps}>Tangkas jaya teknik</button>
                <br />
              </Popup>
            </Marker>
          </MapContainer> */}
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.004306752197!2d115.16993230947804!3d-8.785663591229826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24500319844cd%3A0xfd263e7f2ddff0c3!2sTangkas%20Jaya%20Teknik!5e0!3m2!1sen!2sid!4v1704366933662!5m2!1sen!2sid"
            style={{ border: 2 }}
            className="border-2 border-black rounded-lg z-10 lg:w-[80%] md:w-[80%] w-full h-80 lg:h-[400px]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"

          ></iframe>
        </div>
        <aside className="">
          <div className="flex flex-col items-center px-24">
            <div className="lg:block md:block hidden mt-12">
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
                Jl. Celagi Basur, Jimbaran, Kec. Kuta Sel. Kabupaten Badung,
                Bali 80361
              </p>
            </div>

            <div
              className="text-center flex items-center hover:underline cursor-pointer"
              onClick={openWhatsApp}
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                size="xl"
                className="mr-2 hover:underline"
              />
              <p className="items-center">+62 877-6268-9648</p>
            </div>

            <div
              className="text-center flex items-center hover:underline cursor-pointer"
              onClick={openEmail}
            >
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
