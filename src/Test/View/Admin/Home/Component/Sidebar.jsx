import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHamburger,
  faSignOut,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Content from "./Content";
import image from "../../../../../Asset/wayan logo.png";
import ManageProduct from "./Product/ManageProduct";
import Test from "./Pesanan/ManagePesanan";
import { logout } from "../../../../../Service/Api";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const username = localStorage.getItem("username");
  const [currentView, setCurrentView] = useState("status");
  const navigate = useNavigate();
  const openDrawer = () => {
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const handleMenuClick = (menu) => {
    setCurrentView(menu);
    openDrawer();
  };

  const handleLogoutClick = async () => {
    setIsloading(true);
    try {
      const accessToken = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!accessToken || !username) {
        console.error("Token or username not found in localStorage");
        return;
      }

      const response = await logout(accessToken, username);

      if (response && response.data && response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsloading(false);
        navigate("/login");
        window.location.reload();
      } else {
        console.error("Gagal logout");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative h-full gap-12 w-full">
      <div className="flex justify-between p-4 px-12 bg-white items-center w-[100%]">
        <button
          className="text-black py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue z-30"
          onClick={openDrawer}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div>Tangkas Jaya Teknik - Dashboard</div>
        <div>
          <img src={image} alt="icon" className="w-16 h-16 rounded-full" />
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-full w-full z-20"
            onClick={closeDrawer}
          ></div>

          <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-30 transition-transform transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div
              className="w-fit text-white focus:outline-none focus:shadow-outline-red cursor-pointer"
              onClick={closeDrawer}
            >
              <FontAwesomeIcon icon={faTimes} size="sm" />
            </div>

            <div className="flex justify-center border-b-2 mt-4">
              <div className="flex flex-col gap-4">
                <h1>Selamat Datang</h1>
                <div className="flex justify-center">
                  <FontAwesomeIcon icon={faUser} size="xl"></FontAwesomeIcon>
                </div>
                <h1 className="flex justify-center mb-4">{username}</h1>
              </div>
            </div>

            <div tabIndex={0} className="collapse collapse-arrow text-white">
              <div className="collapse-title text-sm font-medium">Management Data</div>



              <div className="collapse-content text-sm">
                <p
                  className={`border p-2 rounded-full items-center text-center cursor-pointer hover:bg-slate-500 ${
                    currentView === "status" ? "border-green-500" : ""
                  }`}
                  onClick={() => handleMenuClick("status")}
                >
                  Data Pesanan
                </p>
              </div>

              <div className="collapse-content text-sm mt-12">
                <p
                  className={`border p-2 rounded-full items-center text-center cursor-pointer hover:bg-slate-500 ${
                    currentView === "productService" ? "border-green-500" : ""
                  }`}
                  onClick={() => handleMenuClick("productService")}
                >
                  Data Layanan
                </p>
              </div>

           
            </div>
            <div
              className="flex justify-center bg-red-500 p-1 text-white rounded-lg cursor-pointer hover:bg-red-700 items-center gap-2"
              onClick={handleLogoutClick}
            >
              <FontAwesomeIcon icon={faSignOut} size="xl"></FontAwesomeIcon>
            </div>
          </div>
        </>
      )}

      <div className={`flex transition-all ${isOpen ? "ml-60 justify-between" : "ml-auto justify-center"}`}>
        {currentView === "content" ? (
          <Content />
        ) : currentView === "productService" ? (
          <ManageProduct />
        ) : currentView === "status" ? (
          <Test />
        ) : null}
      </div>
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
    </div>
  );
};

export default Sidebar;
