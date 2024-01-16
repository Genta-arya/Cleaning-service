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
import { Helmet } from "react-helmet-async";
import ReactQuill from "react-quill";

const Product = () => {
  const maxDescriptionLength = 55;
  const [showModal, setShowModal] = useState(false);
  const [showModalOrder, setShowModalOrder] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const productsData = useSelector(selectProducts);
  const selectedCategory = useSelector(selectSelectedCategory);

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
        console.log(response);
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
    return `Rp ${price.toLocaleString()}`;
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
          state: {
            productData: product,
            productPrice: product.discount
              ? product.price -
                (product.discount.discountPercentage / 100) * product.price
              : product.price,
          },
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

  const InstagramDots = ({ totalSlides, activeIndex, setActiveIndex }) => {
    const dots = Array.from(
      { length: Math.min(totalSlides, 5) },
      (_, index) => index
    );

    const visibleDots = dots.map((dot, i) => {
      const newIndex = (activeIndex + dot) % totalSlides;

      return (
        <li
          key={i}
          className={`px-2 py-1 rounded-xl animated-dot ${
            newIndex === activeIndex
              ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white "
              : "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-700"
          }`}
        >
          <span className="dot-label text-xs font-bold">{newIndex + 1}</span>
        </li>
      );
    });

    return (
      <div className="flex items-center mt-4 justify-center cursor-default">
        <ul className="flex items-center space-x-1">{visibleDots}</ul>
      </div>
    );
  };

  const settings = {
    infinite: false,
    arrows: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    appendDots: (dots) => (
      <InstagramDots
        totalSlides={dots.length}
        activeIndex={activeDot}
        setActiveIndex={setActiveDot}
      />
    ),

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
      className=" p-3  -mt-20 mb-24 z-50"
    >
      <Helmet>
        <meta content="#5F93C0" name="theme-color" />

        <meta content="#5F93C0" name="msapplication-navbutton-color" />

        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="#5F93C0" name="apple-mobile-web-app-status-bar-style" />
      </Helmet>
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
              <div className="flex justify-center items-center ">
                <div className="grid grid-cols-3 xl:gap-4 xl:space-x-1 lg:space-x-24 p-12 items-center mx-auto">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className={`border rounded-xl  shadow-xl border-gelap transform transition-all overflow-hidden w-96 h-full items-center ${
                        product.discount ? "bg-white" : "bg-white"
                      }`}
                    >
                      <div className="relative">
                        {product.discount && (
                          <div className=" bg-red-500 text-white font-bold rounded-full px-4 p-1 w-fit absolute top-3 left-4 z-10 transform ">
                            <span className=" ">
                              Diskon {product.discount.discountPercentage} %
                            </span>
                            <p className="text-xs">
                              Exp{" "}
                              {new Date(
                                product.discount.expirationDate
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="mb-4 lg:w-full lg:h-48 rounded-t-xl relative overflow-hidden"
                        >
                          <img
                            src={
                              product.url ||
                              "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                            }
                            alt="paket service ac"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleProductClick(product)}
                          />
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-xl cursor-pointer"
                            onClick={() => handleProductClick(product)}
                          >
                            <span className="text-lg font-bold">
                              Detail Produk
                            </span>
                          </motion.div>
                        </motion.div>
                      </div>

                      <div className="p-5">
                        <h2 className="lg:text-xl md:text-xl text-sm font-bold mb-2">
                          {product.nm_product}
                        </h2>

                        <div className="flex items-center justify-between ">
                          {product.discount ? (
                            <>
                              <div className="flex items-center ">
                                <span className=" font-bold text-xs lg:text-base md:text-base  ">
                                  <span className="line-through text-gray-500">
                                    {formatCurrency(product.price)}
                                  </span>{" "}
                                  <span className="text-green-500">
                                    {formatCurrency(
                                      product.price -
                                        (product.discount.discountPercentage /
                                          100) *
                                          product.price
                                    )}
                                  </span>
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="text-green-500 font-bold text-xs lg:text-base md:text-base">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                          <div className="text-gray-500 text-sm">
                            {product.sold === 0
                              ? "Belum Terjual"
                              : `${product.sold} Terjual`}
                          </div>
                        </div>

                        <div className="flex justify-center mt-4 items-center">
                          <button
                            className="bg-biru text-white px-4 py-2 rounded-md hover:bg-blue-300 w-full hover:scale-105 transition-all duration-500 ease-out"
                            onClick={() => handleOrder(product)}
                          >
                            Pesan
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
              <Slider {...settings} className="p-4 md:p-16">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="border  lg:p-4  rounded-xl    bg-white  border-gelap  transform transition-all overflow-hidden"
                  >
                    <div className="relative">
                      {product.discount && (
                        <div className=" bg-red-500 text-white font-bold rounded-full px-4 p-1 w-fit absolute top-3 left-4 z-10 transform ">
                          <span className=" ">
                            Diskon {product.discount.discountPercentage} %
                          </span>
                          <p className="text-xs">
                            Exp{" "}
                            {new Date(
                              product.discount.expirationDate
                            ).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 lg:w-full lg:h-48 rounded-t-xl relative overflow-hidden"
                      >
                        <img
                          src={product.url}
                          alt={product.nm_product}
                          className="mb-4 w-full h-80 flex  rounded-t-xl transition-all transform duration-500 cursor-pointer ease-in object-cover hover:scale-105 hover:rounded-b-xl hover:rounded-t-xl"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-xl cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          <span className="text-lg font-bold">
                            Detail Produk
                          </span>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="p-8">
                      <h2 className="text-xl font-bold mb-2 -mt-8">
                        {product.nm_product}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        <ReactQuill
                          value={truncateDescription(
                            product.desc,
                            maxDescriptionLength
                          )}
                          readOnly={true}
                          className="text-gray-600"
                          theme={"bubble"}
                        />
                      </p>

                      <div className="flex items-center justify-between -mt-12">
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
                                      (product.discount.discountPercentage /
                                        100) *
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
