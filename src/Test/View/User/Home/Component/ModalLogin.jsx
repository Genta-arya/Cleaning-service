import React, { useEffect } from "react";
import Lottie from "lottie-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import animationData from "../../../../../Asset/animationLogin.json";

const ModalLogin = ({ closeModalOrder, navigate }) => {
  useEffect(() => {
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-96 p-12 rounded-md shadow-lg z-50">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeModalOrder}
          >
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
        <p className="text-gray-700 text-lg mb-4 mt-12 text-center font-serif">
          Yuk Login dulu agar bisa order service dari kami.
        </p>
        <div className="flex justify-center w-full">
          <button
            className="bg-biru text-white px-4 py-2 rounded-md hover:bg-gelap  focus:outline-none w-full transition-all hover:scale-105 delay-100"
            onClick={() => navigate("/login")}
          >
            <h1 className="font-bold">Login</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
