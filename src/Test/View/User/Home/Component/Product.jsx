import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import productsData from "../Data/ProductData";
import ModalLogin from "./ModalLogin";
import { checkLoginStatus } from "../../../../../Service/CheckAuth";
import { checkJwt } from "../../../../../Service/Api";
import {
  selectIsAuthenticated,
  setLoggedIn,
} from "../../../../../Feature/Redux/Auth/AuthSlice";

const Product = () => {
  const maxDescriptionLength = 50;
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log(isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();
        console.log(data);
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
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8  px-4 py-5 mb-32">
      {productsData.map((product) => (
        <div
          key={product.id}
          className="border p-4 rounded-md bg-white shadow-md transition transform hover:scale-105"
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
        </div>
      ))}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70">
          <ModalLogin closeModal={closeModal} navigate={navigate} />
        </div>
      )}
    </div>
  );
};

export default Product;
