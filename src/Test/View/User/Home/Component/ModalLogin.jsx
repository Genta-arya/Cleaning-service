import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Lottie from "lottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import animationData from "../../../../../Asset/animationLogin.json";

const ModalLogin = ({ closeModalOrder, navigate }) => {
  const controls = useAnimation();

  useEffect(() => {
    document.body.classList.add("modal-open");

    controls.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });

    controls.start({
      x: [0, -5, 5, -5, 5, 0],
      transition: { repeat: Infinity, repeatType: "mirror", duration: 0.2 },
    });

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [controls]);

  const handleModalClose = async () => {
    await controls.start({
      opacity: 0,
      y: -40,
      scale: 0.8,
      transition: { duration: 0.5, ease: "easeOut" },
    });

    closeModalOrder();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50  p-4 "
    >
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-96 p-12 rounded-md shadow-lg z-50"
        onCloseComplete={handleModalClose}
      >
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
            className="bg-biru text-white px-4 py-2 rounded-md hover:bg-gelap focus:outline-none w-full transition-all hover:scale-105 delay-100"
            onClick={() => navigate("/login")}
          >
            <h1 className="font-bold">Login</h1>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalLogin;
