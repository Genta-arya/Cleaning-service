import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";

const ProductModal = ({ product, closeModal, showModal }) => {
  const formatCurrency = (price) => {
    return `Rp ${price.toLocaleString()}`;
  };
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className=""
 
        >
          <motion.div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center p-8 bg-black bg-opacity-80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-md relative md:w-[70%] w-[95%] overflow-y-auto h-[550px]"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <button
                className="absolute top-2 left-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={closeModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="text-gelap font-bold text-md mb-2 mt-4">
                Detail Katalog :
              </div>
              <img
                src={product.url}
                alt={product.title}
                className="mb-4 w-full h-52 object-cover rounded-md"
              />

              <h2 className="text-xl font-bold mb-2">
                {product.nm_product}{" "}
                <FontAwesomeIcon className="text-green-500" />
              </h2>
              <p className="text-gray-600 mb-4  flex border p-2 rounded-xl">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500 mr-2 py-4 ml-3"
                />

                <ReactQuill
                  value={product.desc}
                  readOnly={true}
                  className="text-gray-600 "
                  theme={"bubble"}
                />
              </p>

              <div className="flex items-center justify-between -mt-12 ml-4">
                {product.discount ? (
                  <>
                    <div className="flex items-center ">
                      <span className=" font-bold  lg:text-base md:text-base  ">
                        <span className="line-through text-gray-500">
                          {formatCurrency(product.price)}
                        </span>{" "}
                        <span className="text-green-500">
                          {formatCurrency(
                            product.price -
                              (product.discount.discountPercentage / 100) *
                                product.price
                          )}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-green-500 font-bold text-base">
                    Harga: {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ProductModal;
