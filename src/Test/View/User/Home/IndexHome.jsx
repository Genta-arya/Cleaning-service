import React, { useEffect } from "react";
import Navbar from "./Component/Navbar";
import Product from "./Component/Product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const IndexHome = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);


  return (
    <div>
      <Navbar />
      <Product />
    </div>
  );
};

export default IndexHome;
