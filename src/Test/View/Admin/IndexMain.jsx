import React, { useEffect, useState } from "react";
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
import logo from "../../../Asset/notfound.png";
import ManagePesanan from "./Home/Component/Pesanan/ManagePesanan";
import Loading from "./Home/Component/Customer/Loading";
import ErrorLayout from "../User/404/ErrorLayout";

const IndexMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error ? (
            <div className="flex justify-center mx-auto h-screen mt-24">
              <ErrorLayout />
            </div>
          ) : (
            <>
              <div className="hidden lg:block md:hidden">
                <Main />
              </div>

              <div className="lg:hidden md:block block">
                <ManagePesanan />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default IndexMain;
