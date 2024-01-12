import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ClipLoader } from "react-spinners";
import { motion, useAnimation } from "framer-motion";
import { getAllImage } from "../../../../../Service/Api";

const Testimoni = () => {
  const [testimonialImages, setTestimonialImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const images = await getAllImage();
        setTestimonialImages(images.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch images: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const animateElement = async () => {
      if (!loading) {
        await controls.start({
          opacity: 1,

          transition: { duration: 1.5, ease: "backInOut" },
        });
      }
    };

    animateElement();
  }, [controls, loading]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: "0",
    arrows: false,
    beforeChange: (current, next) => setCurrentIndex(next),
    appendDots: (dots) => (
      <div className="flex">
        <div className="flex justify-center mt-24 items-center">
          <ul
            style={{ display: "flex" }}
            className=" bg-white p-3 rounded-full  items-center,"
          >
            {dots.map((dot, index) => (
              <li key={index}>{dot}</li>
            ))}
          </ul>
        </div>
      </div>
    ),
    customPaging: (i) => (
      <div className="flex justify-center ">
        <div
          style={{
            backgroundColor: i === currentIndex ? "red" : "gray",
            borderRadius: "100%",
            width:"60px",
            height: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            margin: "0 5px",
          }}
          className="flex justify-center rounded-md "
        ></div>
      </div>
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
      className="bg-biru md:p-12 lg:p-8 p-8  rounded-t-xl"
    >
      <div className="flex justify-center mb-4">
        <h1 className="text-white font-bold font-serif lg:text-2xl md:text-2xl text-lg ">
          Dokumentasi Service Kami
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#ffffff" loading={loading} size={35} />
        </div>
      ) : (
        <>
          {testimonialImages.length === 0 ? (
            <>
              <div className="flex justify-center py-2 mt-8 text-white font-bold text-base">
                Kami Belum Memiliki Dokumentasi Service
              </div>
            </>
          ) : (
            <>
              <motion.div>
                <Slider {...settings} className="mx-auto">
                  {testimonialImages.map((image, index) => (
                    <div
                      key={index}
                      className="slick-slide px-1 lg:px-8 md:px-8 mt-4"
                    >
                      <img
                        src={image}
                        alt={`Testimonial ${index + 1}`}
                        className=" w-full h-80 rounded-3xl py-4  lg:h-96 md:w-full md:h-80  mb-12"
                      />
                    </div>
                  ))}
                </Slider>
              </motion.div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Testimoni;
