import React, { useEffect, useState, useRef } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModalLogin from "./ModalLogin";
import { checkJwt, getProduct } from "../../../../../Service/Api";
import {
  selectIsAuthenticated,
  selectIsRole,
  setLoggedIn,
  setRole,
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
import animationData from "../../../../../Asset/datanotfound.json";
import Lottie from "lottie-react";
import "../../../../../Style/CustomSlider.css";

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
  const isRole = useSelector(selectIsRole);
  const [activeDot, setActiveDot] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();

        if (data.success) {
          dispatch(setLoggedIn(true));
          dispatch(setRole(data.role));

          if (!data.success || (data.role && data.role === "admin")) {
            navigate("/admin/dashboard");
          }
        }
      } catch (error) {}
    };

    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    setIsloading(true);
    const fetchProducts = async () => {
      try {
        const response = await getProduct();
        const { products } = response;
        setIsloading(false);

        dispatch(setProducts(products));

        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category.nm_category))
        );

        dispatch(setCategories(uniqueCategories));
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

  const filteredProducts = selectedCategory
    ? productsData.filter(
        (product) => product.category.nm_category === selectedCategory
      )
    : productsData;
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, scale: 1, rotate: 0 });
  }, []);

  const dotVariants = {
    active: { scale: 1.1, backgroundColor: "white", border: "1px solid #ccc" },
    inactive: {
      scale: 1,
      backgroundColor: "gray",
      border: "1px solid transparent",
    },
  };
  const settings = {
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    appendDots: (dots) => (
      <ul>
        {dots.map((dot, i) => (
          <li key={i} className={i === activeDot ? "active" : ""}>
            {dot}
          </li>
        ))}
      </ul>
    ),
    customPaging: function (i) {
      return (
        <div className="flex items-center">
          <motion.div
            className="w-3 h-3 rounded-full bg-gray-500 mr-2"
            variants={dotVariants}
            initial="inactive"
            animate={i === activeDot ? "active" : "inactive"}
            whileHover={{ scale: 1.1 }}
            onClick={() => setActiveDot(i)}
          />
        </div>
      );
    },
    beforeChange: (current, next) => {
      setActiveDot(next);
    },
  };

  return (
    <motion.div
      id="products"
      animate={controls}
      initial={{ opacity: 0, y: 40, scale: 0.8, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className=" p-3  -mt-20 mb-24"
    >
      <div className="hidden lg:block  ">
        {isLoading ? (
          <SkeletonProduct />
        ) : (
          <>
            <div className="flex justify-center py-8 lg:mb-8 md:mb-8  ">
              <h1 className="text-white font-bold lg:text-3xl md:text-3xl text-2xl border-b-4  p-1 ">
                Layanan Kami
              </h1>
            </div>

            {filteredProducts.length !== 0 && (
              <div className="mb-0">
                <Category />
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <>
                <div className="flex justify-center mb-4 ">
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    className=""
                  />
                </div>
                <p className="text-white text-center">
                  Maaf, saat ini belum ada layanan service yang tersedia.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center gap-4">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="border rounded-xl bg-white shadow-xl border-gelap transform transition-all"
                    >
                      <div>
                        <img
                          src={
                            product.url ||
                            "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                          }
                          alt="paket service ac"
                          className="mb-4 lg:w-full lg:h-48 rounded-t-xl transition-all transform duration-500 cursor-pointer ease-in object-cover hover:scale-105 hover:shadow-lg hover:rounded-b-xl"
                          onClick={() => handleProductClick(product)}
                        />
                      </div>

                      <div className="p-5">
                        <h2 className="lg:text-xl md:text-xl text-sm font-bold mb-2">
                          {product.nm_product}
                        </h2>
                        <p className="text-gray-600 mb-4 lg:block md:block hidden">
                          {truncateDescription(
                            product.desc,
                            maxDescriptionLength
                          )}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-green-500 font-bold text-xs lg:text-base md:text-base">
                            Harga: {formatCurrency(product.price)}
                          </span>
                        </div>

                        <div className="flex justify-center mt-4">
                          <button
                            className="bg-biru text-white px-4 py-2 rounded-md hover:bg-blue-300 w-full  hover:scale-105 transition-all duration-500 ease-out "
                            onClick={() => handleOrder(product)}
                          >
                            Pesan
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden block">
        {isLoading ? (
          <SkeletonProduct />
        ) : (
          <>
            <div className="flex justify-around gap-4 py-8 lg:mb-8 md:mb-8 ">
              <h1 className="text-white font-bold lg:text-3xl md:text-3xl text-2xl border-b-2 border-white p-1">
                Layanan Kami
              </h1>
            </div>
            {filteredProducts.length !== 0 && (
              <div className="flex px-4 ">
                <Category />
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <>
                <div className="flex justify-center mb-4">
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    className=""
                  />
                </div>
                <p className="text-white text-center">
                  Maaf, saat ini belum ada layanan service yang tersedia.
                </p>
              </>
            ) : (
              <Slider {...settings} className="p-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="border  lg:p-4 md:p-0 rounded-xl   bg-white shadow-xl border-gelap  transform transition-all "
                  >
                    <img
                      src={product.url}
                      alt={product.nm_product}
                      className="mb-4 w-full h-80 flex  rounded-t-xl transition-all transform duration-500 cursor-pointer ease-in object-cover hover:scale-105 hover:shadow-lg hover:rounded-b-xl hover:roundedt-xl"
                      onClick={() => handleProductClick(product)}
                    />

                    <div className="p-12">
                      <h2 className="text-xl font-bold mb-2">
                        {product.nm_product}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {truncateDescription(
                          product.desc,
                          maxDescriptionLength
                        )}
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
                    </div>
                  </motion.div>
                ))}
              </Slider>
            )}
          </>
        )}
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
