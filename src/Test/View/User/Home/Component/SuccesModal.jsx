// SuccessModal.jsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../../../Asset/Sukses.json";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SuccessModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-96 p-12 rounded-md shadow-lg z-50">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => navigate("/history")}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <Lottie
            animationData={animationData}
            loop={false}
            autoplay
            className="-mb-16 "
          />
        </div>
        <p className="text-gray-700 text-lg mb-4 mt-12 text-center font-serif">
          Orderanmu Berhasil Terkirim.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
