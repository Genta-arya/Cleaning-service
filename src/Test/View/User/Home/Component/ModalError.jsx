import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import animationData from "../../../../../Asset/locationError.json";

const ModalError = ({ onClose, isModalOpen }) => {
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-4 ">
            <motion.div
              className="bg-white p-8 rounded-md shadow-lg z-50 w-[30%]"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              exit={{ scale: 0.5 }}
            >
              <div className="flex justify-end">
                <button
                  className="  bg-biru px-2 py-1 rounded-full text-white z-50 hover:scale-105 duration-300 ease-in hover:bg-blue-400"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="flex justify-center mb-4">
                <Lottie
                  animationData={animationData}
                  loop
                  autoplay
                  className="-mb-16 -mt-20 -z-0"
                />
              </div>
              <p className=" text-lg mb-4 mt-20 text-center font-serif bg-biru p-2 rounded-lg text-white">
                Yahh , Lokasi Kamu saat ini belum dalam jangkauan kami
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalError;
