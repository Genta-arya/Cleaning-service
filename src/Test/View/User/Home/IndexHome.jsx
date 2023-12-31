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
import Loading from "../../Admin/Home/Component/Customer/Loading";

const IndexHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();

        if (data.success) {
          dispatch(setLoggedIn(true));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
       
        setLoading(false);
      }
    };
    fetchData();

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

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={isDarkTheme ? "dark-theme" : "light-theme"}>
            <Navbar toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
            <LandingPage />
            <Product />

            <AboutMe />

            <Testimoni />
            <CustomerReviews />
            <Footer />
            <Copyright />

            {showScrollToTop && (
              <button
                className="fixed bottom-24 lg:bottom-12 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none"
                onClick={scrollToTop}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default IndexHome;
