import React, { useEffect, useState } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModalLogin from "./ModalLogin";
import { checkJwt, getProduct } from "../../../../../Service/Api";
import {
  selectIsAuthenticated,
  setLoggedIn,
} from "../../../../../Feature/Redux/Auth/AuthSlice";
import ProductModal from "./ProductModal";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  selectCategories,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
  selectSelectedCategory,
  setCategories,
  setError,
  setProducts,
} from "../../../../../Feature/Redux/Product/ProductSlice";
import Category from "./Category";
import SkeletonProduct from "./SkeletonProduct";

const Product = () => {
  const maxDescriptionLength = 50;
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const productsData = useSelector(selectProducts);
  const productsError = useSelector(selectProductsError);
  const productsStatus = useSelector(selectProductsStatus);
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProduct();
        const { products } = response;

        dispatch(setProducts(products));

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category.nm_category))
        );
        setIsloading(true);

        dispatch(setCategories(uniqueCategories));
        console.log(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsloading(false);
        dispatch(setError(error.message));
      }
    };

    fetchProducts();
  }, [dispatch]);

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
      navigate(
        `/order/${product.id}/${encodeURIComponent(product.nm_product)}`,
        {
          state: { productData: product },
        }
      );
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

  const filteredProducts = selectedCategory
    ? productsData.filter(
        (product) => product.category.nm_category === selectedCategory
      )
    : productsData;
  const startAnimation = async () => {
    await controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 1 }}
      onMouseEnter={startAnimation}
      className="lg:p-12 md:p-12 p-3 lg:-mt-12 "
    >
      <div className="hidden lg:block ">
        <div className="flex justify-center py-8 lg:mb-8 md:mb-8 ">
          <h1 className="text-white font-bold lg:text-3xl md:text-3xl text-2xl border-b-4 border-white p-1">
            Service Kami
          </h1>
        </div>

        {!isLoading ? (
          <SkeletonProduct />
        ) : (
          <>
            <div className="mb-0">
              <Category />
            </div>

            <div
              className="flex justify-center lg:gap-8 md:gap-8 gap-1"
              ref={ref}
              onMouseEnter={startAnimation}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="border p-10 lg:p-4  md:p-12 rounded-xl  bg-white w-96 shadow-xl border-gelap  transform transition-all "
                >
                  <img
                    src={
                      product.url ||
                      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                    }
                    alt={product.nm_product}
                    className="mb-4 lg:w-full lg:h-48 md:w-full md:h-48 object-cover rounded-2xl hover:scale-105 transition-all transform duration-200 delay-200 ease-in cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  />

                  <h2 className="lg:text-xl md:text-xl text-sm font-bold mb-2">
                    {product.nm_product}
                  </h2>
                  <p className="text-gray-600 mb-4 lg:block md:block hidden">
                    {truncateDescription(product.desc, maxDescriptionLength)}
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
            </div>
          </>
        )}
      </div>

      {/* Mobile View */}

      <div className="lg:hidden block">
        <div className="flex justify-around gap-4 py-8 lg:mb-8 md:mb-8 ">
          <h1 className="text-white font-bold lg:text-3xl md:text-3xl text-2xl border-b-2 border-white p-1">
            Layanan Kami
          </h1>
        </div>
        <div className="flex px-4 ">
          <Category />
        </div>
        <Slider
          infinite={false}
          arrows={false}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          className="p-4"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="border p-10 lg:p-4  md:p-12 rounded-xl   bg-white shadow-xl border-gelap  transform transition-all "
            >
              <img
                src={product.url}
                alt={product.nm_product}
                className="mb-4 w-full h-48 object-cover rounded-2xl hover:scale-105 transition-all transform duration-200 delay-200 ease-in cursor-pointer"
                onClick={() => handleProductClick(product)}
              />
              <h2 className="text-xl font-bold mb-2">{product.nm_product}</h2>
              <p className="text-gray-600 mb-4">
                {truncateDescription(product.desc, maxDescriptionLength)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-500 font-bold text-base">
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
        </Slider>
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
    </motion.div>
  );
};

export default Product;
