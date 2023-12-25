import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import productsData from "../Data/ProductData";
import ModalLogin from "./ModalLogin";
import { checkJwt } from "../../../../../Service/Api";
import {
  selectIsAuthenticated,
  setLoggedIn,
} from "../../../../../Feature/Redux/Auth/AuthSlice";
import ProductModal from "./ProductModal";
import { motion, useAnimation } from "framer-motion";

const Product = () => {
  const maxDescriptionLength = 50;
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();
        if (data.success) {
          dispatch(setLoggedIn(true));
        }
      } catch (error) {}
    };

    fetchData();
  }, [dispatch, navigate]);

  const formatCurrency = (price) => {
    if (price >= 1000) {
      const truncatedPrice = Math.floor(price / 1000);
      return `Rp ${truncatedPrice}k`;
    } else {
      return `Rp ${price}`;
    }
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    } else {
      return `${description.slice(0, maxLength)}...`;
    }
  };

  const handleOrder = (product) => {
    if (isAuthenticated) {
      navigate(`/order/${product.id}/${encodeURIComponent(product.title)}`, {
        state: { productData: product },
      });
    } else {
      setShowModalOrder(true);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const closeModalOrder = () => {
    setShowModalOrder(false);
  };

  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, scale: 1 });
  }, [controls]);

  return (
    <div className="p-12">
      <div className="flex justify-center py-8 mb-8">
        <h1 className="text-white font-bold text-3xl">Katalog Kami</h1>
      </div>
      <div className="flex justify-center gap-8 ">
        {productsData.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={controls}
            transition={{ duration: 0.5 }}
            className="border p-4 rounded-3xl bg-white shadow-md cursor-pointer transform hover:scale-105 transition-all delay-150"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="mb-4 w-full h-48 object-cover rounded-md"
            />

            <h2 className="text-xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">
              {truncateDescription(product.description, maxDescriptionLength)}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-green-500 font-bold">
                Harga: {formatCurrency(product.price)}
              </span>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                onClick={() => handleOrder(product)}
              >
                Pesan
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModalOrder && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
          <ModalLogin closeModalOrder={closeModalOrder} navigate={navigate} />
        </div>
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          closeModal={closeModal}
          showModal={showModal}
        />
      )}
    </div>
  );
};

export default Product;
