import React, { useEffect, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import animationData from "../../../../../../Asset/notfound.png";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const ViewImage = ({ images, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeModalOrder = () => {
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [onClose]);

  const galleryImages = images.map((image) => ({
    original: image.imageUrl,
    thumbnail: image.imageUrl,
  }));

  const customStyles = {
    gallery: {
      backgroundColor: "#1a1a1a",
    },
  };
  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: "0%", opacity: 1 },
  };

  return (
    <>
      <div>
        {images && images.length > 0 ? (
          <>
            <div className="fixed flex-col bg-black bg-opacity-50 flex items-center justify-center lg:block md:block hidden ">
              <ImageViewer
                src={images.map((image) => image.imageUrl)}
                currentIndex={currentImage}
                onClose={onClose}
                backgroundStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.9)",
                }}
              />
            </div>
            <AnimatePresence >
              <motion.div
                key="modal"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={modalVariants}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="fixed inset-0 z-50 flex items-start justify-end overflow-x-auto bg-black bg-opacity-90 lg:hidden md:hidden"
              >
                <div className="bg-white w-full overflow-x-hidden rounded-lg shadow-lg mt-auto p-8 rounded-t-2xl">
                  <div className="border-t-4 border-gray-400 my-4 mx-auto w-16 rounded-full mt-2"></div>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 text-black rounded-full focus:outline-none"
                      onClick={onClose}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  <div className="flex justify-center bg-white overflow-x-hidden h-96">
                    <Gallery
                      items={galleryImages}
                      currentIndex={currentIndex}
                      onClose={onClose}
                      onSlide={(index) => setCurrentIndex(index)}
                      styles={customStyles}
                    />
                    <div className="hidden">
                      <style>
                        {`.image-gallery-fullscreen-button { display: none !important; }`}
                      </style>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
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
      </div>
    </>
  );
};

export default ViewImage;
