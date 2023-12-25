import React, { useEffect } from "react";
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

const IndexHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    </div>
  );
};

export default IndexHome;
