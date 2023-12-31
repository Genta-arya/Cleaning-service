import React, { useEffect } from "react";
import Sidebar from "./Home/Component/Sidebar";
import Main from "./Home/Main";
import { checkJwt } from "../../../Service/Api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectIsRole,
  setLoggedIn,
  setRole,
} from "../../../Feature/Redux/Auth/AuthSlice";
import logo from "../../../Asset/notfound.png"
const IndexMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectIsRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();

        if (data.success) {
          dispatch(setLoggedIn(true));
          dispatch(setRole(data.role));

          if (data.role !== "admin") {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  return (
    <>
      <div className="hidden lg:block md:block">
        <Main />
      </div>

      <div className="lg:hidden md:hidden block">
        <div className=" flex items-center justify-center h-screen">
          <div className="flex flex-col">
            <img src={logo} alt="logo" className="w-40 h-40 flex justify-center mx-auto " />
            <h1 className="text-center">
              Maaf Versi Mobile sedang dalam pengembangan
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexMain;
