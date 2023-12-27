import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import animationData from "../../../../../Asset/notif.json";
import Lottie from "lottie-react";

const ModalNotifikasi = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-96 p-12 rounded-md shadow-lg z-50">
        <div className="flex justify-end" onClick={onClose}>
          <button className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="-mb-16 "
          />
        </div>
        <p className="text-gray-700 text-sm mb-4 mt-12 text-center font-serif">
          Belum ada pemberitahuan untuk mu.
        </p>
      </div>
    </div>
  );
};

export default ModalNotifikasi;
