import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPaperclip,
  faSeedling,
  faTimes,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { getAllComments, postComment } from "../../../../../Service/Api";
import { selectIsAuthenticated } from "../../../../../Feature/Redux/Auth/AuthSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModalComment from "./ModalComment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "lottie-react";
import animationData from "../../../../../Asset/Verif.json";
import { PulseLoader } from "react-spinners";

function ReviewForm({ onSubmitReview }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [name, setUsername] = useState("");
  const [rating, setRating] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeColor, setActiveColor] = useState("#FCD34D");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowModalOrder] = useState(false);
  const navigate = useNavigate();
  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    toast.error(message);
  };
  const closeModalOrder = () => {
    setShowModalOrder(false);
  };

  const determineActiveColor = (rating) => {
    if (rating >= 4) {
      return "#5CB85C";
    } else if (rating >= 2) {
      return "#F0AD4E";
    } else {
      return "#D9534F";
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isAuthenticated) {
      setShowModalOrder(true);
      setIsLoading(false);
      return;
    }

    if (newReview.trim().length > 100) {
      toast.error("Komentar terlalu panjang, maksimal hanya 100 karakter ya");
      return;
    }
    if (newReview.trim() === "" || name.trim() === "" || rating === 0) {
      toast.error("Form komentar harus diisi semua ya");
      return;
    }

    try {
      await postComment(name, newReview, rating);
      setIsLoading(false);

      setReviews([...reviews, { name, rating, comment: newReview }]);
      setNewReview("");
      setRating(0);
      setActiveColor("#FCD34D");
      onSubmitReview({ name, rating, comment: newReview });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error posting comment:", error);
    
      showAlertMessage("Failed to post comment. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    setNewReview(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);

    setActiveColor(determineActiveColor(newRating));
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setActiveColor("#FCD34D");

    setRating(0);
  };

  const getStarIcons = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starIcon = i <= rating ? solidStar : regularStar;
      const starClass = i <= rating ? "text-yellow-500" : "text-gray-300";
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={starIcon}
          className={`mr-1 text-xl ${starClass}`}
          onClick={() => handleRatingChange(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="border-2 border-gray-200 lg:p-12 mt-12 mb-8 rounded-xl p-4">
      <form onSubmit={handleSubmit} className="flex flex-col items-start">
        <div className="mb-4 w-full"></div>
        <div className="mb-4 w-full cursor-pointer">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-white mb-1 "
          >
            Rating:
          </label>
          <div className="flex ">{getStarIcons()}</div>
        </div>
        <div className="mb-4 w-full">
          <label
            htmlFor="review"
            className="block text-sm font-medium text-white"
          >
            Komentar:
          </label>
          <textarea
            rows="4"
            cols="50"
            id="review"
            placeholder="Tulis Komentarmu pelayanan service kami disini yaa..."
            value={newReview}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md textarea textarea-info"
            required
          />
        </div>

        <div className="w-full text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-white text-biru rounded-md hover:bg-gray-200"
            onClick={handleSubmit}
          >
            <h1 className="text-base font-bold">Kirim</h1>
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="bg-white  rounded-md relative w-80 lg:w-auto "
          >
            <div className="flex justify-center mb-4">
              <Lottie
                animationData={animationData}
                loop={false}
                autoplay
                className="w-96 h-96 "
              />
            </div>
            <p className="text-xl font-bold mb-4   flex justify-center">
              Komentar berhasil dikirim!
            </p>
            <button
              onClick={handleCloseSuccessModal}
              className="  text-black rounded-md  absolute top-2 right-4"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </motion.div>
        </motion.div>
      )}
      {showLoginModal && (
        <ModalComment closeModalOrder={closeModalOrder} navigate={navigate} />
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-center">
              <PulseLoader color="#5F93C0" size={25} />
            </div>
            <p>Tunggu sebentar</p>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ReviewForm;
