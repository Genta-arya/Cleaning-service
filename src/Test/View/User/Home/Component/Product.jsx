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
import { useInView } from "react-intersection-observer";

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
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-100px 0px",
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <div className="lg:p-12 md:p-12 p-3">
      <div className="flex justify-center py-8 lg:mb-8 md:mb-8">
        <h1 className="text-white font-bold lg:text-3xl md:text-3xl text-2xl">
          Katalog Kami
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 1, y: 40 }}
        animate={controls}
        transition={{ duration: 2 }}
        className="flex justify-center lg:gap-8 md:gap-8 gap-1 "
        ref={ref}
      >
        {productsData.map((product, index) => (
          <motion.div
            key={product.id}
            className="border p-10 lg:p-4  md:p-12 rounded-xl  bg-white w-fit shadow-xl border-gelap  transform transition-all "
          >
            <img
              src={product.image}
              alt={product.title}
              className="mb-4 lg:w-full lg:h-48 md:w-full md:h-48  object-cover rounded-2xl hover:scale-105 transition-all transform duration-200 delay-200 ease-in cursor-pointer"
              onClick={() => handleProductClick(product)}
            />

            <h2 className="lg:text-xl md:text-xl text-sm font-bold mb-2">
              {product.title}
            </h2>
            <p className="text-gray-600 mb-4 lg:block md:block hidden">
              {truncateDescription(product.description, maxDescriptionLength)}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-green-500 font-bold text-xs lg:text-base md:text-base">
                Harga: {formatCurrency(product.price)}
              </span>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="bg-biru text-white px-4 py-2 rounded-md hover:bg-gelap w-full"
                onClick={() => handleOrder(product)}
              >
                Pesan
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

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
