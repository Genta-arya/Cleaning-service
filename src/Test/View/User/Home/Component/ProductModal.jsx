import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const ProductModal = ({ product, closeModal, showModal }) => {
  const formatCurrency = (price) => {
    if (price >= 1000) {
      const truncatedPrice = Math.floor(price / 1000);
      return `Rp ${truncatedPrice}k`;
    } else {
      return `Rp ${price}`;
    }
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
    <>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-white p-8 rounded-md relative">
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
              src={product.image}
              alt={product.title}
              className="mb-4 w-full h-52 object-cover rounded-md"
            />

            <h2 className="text-xl font-bold mb-2">
              {product.title} <FontAwesomeIcon className="text-green-500" />
            </h2>
            <p className="text-gray-600 mb-4">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2"
              />
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-green-500 font-bold">
                Harga: {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ProductModal;
