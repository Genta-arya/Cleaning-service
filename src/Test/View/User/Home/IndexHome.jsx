import React, { useEffect, useState } from "react";
import Navbar from "./Component/Navbar";
import Product from "./Component/Product";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LandingPage from "./Component/LandingPage";
import Testimoni from "./Component/Testimoni";
import { checkJwt } from "../../../../Service/Api";
import { setLoggedIn } from "../../../../Feature/Redux/Auth/AuthSlice";
import AboutMe from "./Component/AboutMe";
import Footer from "./Component/Footer";
import Copyright from "./Component/Copyright";
import CustomerReviews from "./Component/Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const IndexHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

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

    // Event listener to show/hide scroll-to-top button
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, navigate]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <LandingPage />
      <Testimoni />
      <AboutMe />
      <Product />
      <CustomerReviews />
      <Footer />
      <Copyright />

      {showScrollToTop && (
        <button
          className="fixed bottom-24 lg:bottom-12  right-4  z-50 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none"
          onClick={scrollToTop}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default IndexHome;
