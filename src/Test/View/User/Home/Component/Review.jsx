import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import Slider from "react-slick";
import { getAllComments } from "../../../../../Service/Api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewForm from "./ReviewForm";
import Lottie from "lottie-react";
import animationData from "../../../../../Asset/Pesanan.json";
function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getAllComments();
      const latestReviews = fetchedComments.slice(-6).reverse();

      setReviews(latestReviews);
      console.log(latestReviews);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addReview = async (newReview) => {
    await fetchComments();
  };

  const getStarIcons = (rating, username) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIcon = i <= rating ? solidStar : regularStar;
      const starClass = i <= rating ? "text-yellow-500" : "text-gray-300";
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={starIcon}
          className={`mr-1 text-xl ${starClass}`}
        />
      );
    }
    return stars;
  };

  const settings = {
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,

    autoplaySpeed: 3000,
    customPaging: function (i) {
      return (
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: i === activeDot ? "white" : "#ccc",
            margin: "0 5px",
            opacity: "0.7",
            transition: "opacity 0.6s ease",
            marginTop: 20,
          }}
        ></div>
      );
    },
    beforeChange: (current, next) => {
      setActiveDot(next);
    },
  };
  const timeAgo = (timestamp) => {
    const targetDate = new Date(timestamp);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate - targetDate) / 1000);

    const intervals = {
      tahun: 31536000,
      bulan: 2592000,
      minggu: 604800,
      hari: 86400,
      jam: 3600,
      menit: 60,
    };

    let timeAgoString = "";

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const intervalCount = Math.floor(differenceInSeconds / secondsInUnit);

      if (intervalCount > 0) {
        if (unit === "menit" && intervalCount > 1) {
          timeAgoString = `${intervalCount} menit yang lalu`;
        } else {
          timeAgoString = `${intervalCount} ${unit}${
            intervalCount > 1 ? "" : ""
          } yang lalu`;
        }
        break;
      }
    }

    return timeAgoString || "Baru saja";
  };

  return (
    <div className="container mx-auto border-t-4 border-gray-400 p-4 lg:p-24 md:p-8">
      <h2
        id="comment-section"
        className="text-3xl font-bold mb-10 text-center text-white w-80 lg:w-80 md:w-64 rounded-full mt-4"
      >
        Ulasan Pelanggan
      </h2>

      {reviews.length === 0 && (
        <div>
          <div className="flex justify-center">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay
              className=" w-80 h-80"
            />
          </div>
          <h1 className="flex justify-center text-white font-bold">Belum ada Ulasan</h1>
        </div>
      )}

      <div className="lg:block md:block hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-300 p-4 rounded-3xl shadow-2xl hover:scale-90 transition-all delay-75"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {review.rating}
                  </span>
                </div>
                <div className="ml-2">
                  <h3 className="text-xl font-semibold">{review.username}</h3>
                  <div className="text-gray-600">
                    {getStarIcons(review.rating, review.username)}
                  </div>
                  <span className="text-lg font-bold text-gray-500">
                    @{review.user.username}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{review.review}</p>
              <div className="flex justify-end">
                <h1 className="text-sm text-gray-600">
                  {timeAgo(review.createdAt)}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden md:hidden block p-8 mx-auto px-4">
        <Slider {...settings}>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-300 p-4 rounded-lg  hover:scale-90 transition-all delay-75 px-4"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {review.rating}
                  </span>
                </div>
                <div className="ml-2">
                  <h3 className="text-xl font-semibold">{review.username}</h3>
                  <div className="text-gray-600">
                    {getStarIcons(review.rating, review.username)}
                  </div>
                  <span className="text-lg font-bold text-gray-500">
                    @{review.user.username}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{review.review}</p>
              <div className="flex justify-end">
                <h1 className="text-xs text-gray-600">
                  {timeAgo(review.createdAt)}
                </h1>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <ReviewForm onSubmitReview={addReview} />
    </div>
  );
}

export default CustomerReviews;
