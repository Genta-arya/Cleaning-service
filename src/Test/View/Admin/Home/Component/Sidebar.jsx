import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChartBar,
  faCircle,
  faClipboardCheck,
  faDatabase,
  faHamburger,
  faMoneyBill,
  faMoneyCheckDollar,
  faPerson,
  faSignOut,
  faTimes,
  faUser,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import Content from "./Content";
import image from "../../../../../Asset/wayan logo.png";
import ManageProduct from "./Product/ManageProduct";
import Test from "./Pesanan/ManagePesanan";
import { logout } from "../../../../../Service/Api";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import ListCustomer from "./Customer/ListCustomer";
import ChartComponent from "./Chart/Chart";
import { motion } from "framer-motion";
import Loading from "./Customer/Loading";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const username = localStorage.getItem("username");
  const [currentView, setCurrentView] = useState("status");
  const [isManageUserOpen, setIsManageUserOpen] = useState(false);

  const [isManageDataOpen, setIsManageDataOpen] = useState(true);

  const [isManageGraphicOpen, setIsManageGraphicOpen] = useState(false);
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
   
      translateY: 0,
      transition: {
        ease: "easeOut",
        duration: 1,
      },
    },
    closed: {
      x: 0,
      opacity: 0,
      
    
 
      transition: {
        ease: "easeIn",
        duration: 0.2,
      },
    },
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const toggleManageData = () => {
    setIsManageDataOpen(!isManageDataOpen);
    setIsManageUserOpen(false);
    setIsManageGraphicOpen(false);
  };

  const toggleManageGraphic = () => {
    setIsManageGraphicOpen(!isManageGraphicOpen);
    setIsManageUserOpen(false);
    setIsManageDataOpen(false);
  };
  const navigate = useNavigate();
  const openDrawer = () => {
    setIsOpen(true);
  };
  const toggleManageUser = () => {
    setIsManageUserOpen(!isManageUserOpen);
    setIsManageDataOpen(false);
    setIsManageGraphicOpen(false);
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
    <div className="relative h-full gap-12 w-screen">
      <motion.div className="flex justify-between p-4 px-12 bg-gray-800 text-white font-bold items-center w-[100%]">
        <button
          className="text-black py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue z-30"
          onClick={openDrawer}
        >
          <FontAwesomeIcon
            icon={faBars}
            className="text-white  hover:scale-150 overflow-hidden duration-300 ease-in"
          />
        </button>

        <div>Tangkas Jaya Teknik - Dashboard</div>
        <div>
          <img src={image} alt="icon" className="w-16 h-16 rounded-full" />
        </div>
      </motion.div>

      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 h-full w-full z-20"
            onClick={closeDrawer}
          ></div>

          <motion.div
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={sidebarVariants}
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-30 transition-transform transform  ${
              isOpen ? "translate-x-0 " : "-translate-x-full"
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

            <div>
              <ul className={`w-full  flex flex-col `}>
                <li
                  className={`p-4 cursor-pointer ${
                    isManageDataOpen
                      ? "border border-green-500 rounded-full text-white mt-4"
                      : ""
                  }`}
                  onClick={toggleManageData}
                >
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className={`mr-2 ${
                      isManageDataOpen ? "text-green-500 " : ""
                    } `}
                  />
                  Data Service
                </li>
                {isManageDataOpen && (
                  <div className="ml-8">
                    <ul>
                      <li
                        className={`p-4 cursor-pointer ${
                          currentView === "status"
                            ? "border border-green-500 rounded-full text-white mt-4"
                            : ""
                        }`}
                        onClick={() => handleMenuClick("status")}
                      >
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="mr-2"
                          style={{
                            color: currentView === "status" ? "green" : "",
                          }}
                        />
                        Manage Pesanan
                      </li>
                      <li
                        className={`p-4 cursor-pointer ${
                          currentView === "productService"
                            ? "border-green-500 rounded-full text-white mt-4 border"
                            : ""
                        }`}
                        onClick={() => handleMenuClick("productService")}
                      >
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="mr-2"
                          style={{
                            color:
                              currentView === "productService" ? "green" : "",
                          }}
                        />
                        Manage Service
                      </li>
                    </ul>
                  </div>
                )}

                <li
                  className={`p-4 cursor-pointer ${
                    isManageUserOpen
                      ? "border-green-500 rounded-full text-white mt-4 border"
                      : ""
                  }`}
                  onClick={toggleManageUser}
                >
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className={`mr-1 ${
                      isManageUserOpen ? "text-green-500 " : ""
                    } `}
                  />
                  Data Pelanggan
                </li>
                {isManageUserOpen && (
                  <div className="ml-8">
                    <ul>
                      <li
                        className={`p-4 cursor-pointer ${
                          currentView === "customerItem"
                            ? "border-green-500 rounded-full text-white mt-4 border"
                            : ""
                        }`}
                        onClick={() => handleMenuClick("customerItem")}
                      >
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="mr-2"
                          style={{
                            color:
                              currentView === "customerItem" ? "green" : "",
                          }}
                        />
                        Daftar Pelanggan
                      </li>
                    </ul>
                  </div>
                )}
                <li
                  className={`p-4 cursor-pointer ${
                    isManageGraphicOpen
                      ? "border-green-500 rounded-full text-white mt-4 border"
                      : ""
                  }`}
                  onClick={toggleManageGraphic}
                >
                  <FontAwesomeIcon
                    icon={faMoneyCheckDollar}
                    className={`mr-2 ${
                      isManageGraphicOpen ? "text-green-500 " : ""
                    } `}
                  />
                  Data Penghasilan
                </li>
                {isManageGraphicOpen && (
                  <div className="ml-8">
                    <ul>
                      <li
                        className={`p-4 cursor-pointer ${
                          currentView === "graphic"
                            ? "border-green-500 rounded-full text-white mt-4 border"
                            : ""
                        }`}
                        onClick={() => handleMenuClick("graphic")}
                      >
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="mr-2"
                          style={{
                            color: currentView === "graphic" ? "green" : "",
                          }}
                        />
                        Graphic
                      </li>
                    </ul>
                  </div>
                )}
              </ul>
            </div>

            <div
              className="flex justify-center bg-red-500 p-1 text-white rounded-lg cursor-pointer hover:bg-red-700 items-center gap-2 mt-4"
              onClick={handleLogoutClick}
            >
              <FontAwesomeIcon icon={faSignOut} size="xl"></FontAwesomeIcon>
            </div>
          </motion.div>
        </>
      )}

      <div
        className={`flex transition-all ${
          isOpen ? "ml-60 justify-between" : "ml-auto justify-center"
        }`}
      >
        {currentView === "content" ? (
          <Content />
        ) : currentView === "productService" ? (
          <ManageProduct />
        ) : currentView === "status" ? (
          <Test />
        ) : currentView === "customerItem" ? (
          <ListCustomer />
        ) : currentView === "graphic" ? (
          <ChartComponent />
        ) : null}
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <Loading />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
