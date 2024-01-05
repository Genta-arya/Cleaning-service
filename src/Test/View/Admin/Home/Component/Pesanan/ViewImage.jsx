import React, { useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import animationData from "../../../../../../Asset/notfound.png";
import { motion, useAnimation } from "framer-motion";
import Lottie from "lottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ViewImage = ({ images, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const closeModalOrder = () => {
    onClose();
  };

  return (
    <>
      {images && images.length > 0 ? (
        <div className="fixed flex-col bg-black bg-opacity-50 flex items-center justify-center">
          <ImageViewer
            src={images.map((image) => image.imageUrl)}
            currentIndex={currentImage}
            onClose={onClose}
            backgroundStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
          />
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white w-96 p-12 rounded-md shadow-lg z-50"
              onCloseComplete={closeModalOrder}
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
                <img src={animationData} alt="image"></img>
              </div>
              <p className="text-gray-700 text-lg mb-4 mt-12 text-center font-serif">
                Upps Gambar Tidak ditemukan
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default ViewImage;
