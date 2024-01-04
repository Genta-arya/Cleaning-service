import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import BottomSheet from "./BottomSheet";
import { getHistory, handleLogout, logout } from "../../../../../Service/Api";
import { selectIsAuthenticated } from "../../../../../Feature/Redux/Auth/AuthSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../../../../Asset/wayan logo.png";
import { ClipLoader, PulseLoader } from "react-spinners";
import { child, getDatabase, onValue, ref, remove } from "firebase/database";

import { toast } from "react-toastify";
import { firebaseApp } from "../../../../../Feature/Firebase/FirebaseConfig";

const Navbar = ({ toggleTheme, isDarkTheme }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownNotifikasi, setDropdownOpenNotifikasi] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [orderIdFromHistory, setOrderIdFromHistory] = useState([]);
  const [url, setUrl] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { orders } = await getHistory(0);

        const orderIds = orders.map((order) => order.orderDetails.orderId);
        const images = orders.map((order) => order.orderDetails.url);

        setOrderIdFromHistory(orderIds);

        setUrl(images);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {}, [notifications]);

  useEffect(() => {
    try {
      const database = getDatabase(firebaseApp);
      const notificationsRef = ref(database, "notifications");

      const unsubscribe = onValue(notificationsRef, (snapshot) => {
        const notificationsData = snapshot.val();

        if (notificationsData) {
          const filteredNotifications = Object.entries(notificationsData)
            .filter(([orderId]) => orderIdFromHistory.includes(Number(orderId)))
            .map(([orderId, orderDetails]) => ({
              orderId: Number(orderId),
              message: orderDetails.message || "",
            }));

          setNotifications(filteredNotifications);
        } else {
          setNotifications([]);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
    }
  }, [orderIdFromHistory, setNotifications]);

  const notificationCount = notifications.length;

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdownNotif = () => {
    setDropdownOpenNotifikasi(!isDropdownNotifikasi);
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
        window.location.reload();
      } else {
        toast.error("logout tidak berhasil");
        setIsloading(false);
      }
    } catch (error) {
      toast.error("Maaf seperti nya server sedang bermasalah");
      setIsloading(false);
    }
  };

  const handleNotificationClick = async (orderId) => {
    try {
      const database = getDatabase(firebaseApp);
      const notificationsRef = ref(database, "notifications");
      const orderIdRef = child(notificationsRef, orderId.toString());

      await remove(orderIdRef);
      handleToPesanan();
    } catch (error) {}
  };

  const handleToLogin = () => {
    navigate("/login");
  };

  const handleToRegister = () => {
    navigate("/register");
  };
  const handleToPesanan = () => {
    navigate("/history");
  };

  return (
    <div
      className={`flex justify-center w-full ${
        isDarkTheme ? "dark-theme" : "light-theme"
      }`}
    >
      <img
        src={logo}
        alt="logo-wayan"
        className="h-40 w-40  object-fill lg:hidden md:hidden block mt-20 bg-white rounded-xl"
      />
      <div className="lg:hidden md:hidden block">
        <BottomSheet />
      </div>
      <div
        className={`bg-white p-2 w-[95%] rounded-xl lg:block md:block hidden mt-8 ${
          isDarkTheme ? "dark-theme" : "light-theme"
        }`}
      >
        <nav className="text-white">
          <div className=" flex justify-between items-center px-12 ">
            <img
              src={logo}
              alt="logo-wayan"
              className="h-20 w-20 object-fill"
            />
            <div className="lg:block md:block hidden space-x-8  relative items-center">
              {isAuthenticated ? (
                <>
                  {notificationCount > 0 && (
                    <span
                      className="bg-red-500 text-white rounded-full absolute -top-3 right-12 px-2 py-1 text-xs"
                      ref={dropdownRef}
                    >
                      {notificationCount}
                    </span>
                  )}
                  <FontAwesomeIcon
                    icon={faBell}
                    className={`text-2xl cursor-pointer hover:text-gray-300 text-biru ${
                      isDropdownOpen ? "" : ""
                    }`}
                    onClick={toggleDropdownNotif}
                  />

                  {isDropdownNotifikasi && (
                    <div className="absolute right-16 mt-2 w-80 bg-white text-black rounded-lg shadow-2xl drop-shadow-2xl border-2 border-gelap p-4">
                      <div className="flex justify-center p-2 mb-4 bg-biru text-white rounded-full font-bold">
                        <h1>Pemberitahuan</h1>
                      </div>
                      {notifications.length > 0 ? (
                        <ul className="list-none max-h-48 overflow-y-auto p-2">
                          {notifications.map((notification, index) => (
                            <li
                              key={notification.orderId}
                              className={`bg-gray-100 p-4 mb-2 rounded-md cursor-pointer${
                                index % 2 === 0 ? "bg-gray-200" : ""
                              } animate__animated animate__fadeIn cursor-pointer hover:bg-gray-300`}
                              onClick={() =>
                                handleNotificationClick(notification.orderId)
                              }
                            >
                              {notification.message}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex justify-center">
                          Tidak ada pemberitahuan
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative inline-block" ref={dropdownRef}>
                    <FontAwesomeIcon
                      icon={faUser}
                      className={`text-2xl cursor-pointer hover:text-gray-300 text-biru ${
                        isDropdownOpen ? "" : ""
                      }`}
                      onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                      <div className="absolute right-4 mt-2 w-48 bg-white text-black rounded-lg shadow-2xl drop-shadow-2xl border-2 border-gelap p-4">
                        <div
                          className="cursor-pointer border-b-2 border-biru p-1"
                          onClick={handleToPesanan}
                        >
                          <FontAwesomeIcon
                            icon={faClipboardList}
                            className="mr-2"
                          />
                          Pesanan
                        </div>
                        <div
                          onClick={handleLogoutClick}
                          className="cursor-pointer border-b-2 border-biru p-1"
                        >
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="mr-2"
                          />
                          Keluar
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="text-biru font-bold"
                    onClick={handleToLogin}
                  >
                    Login
                  </button>
                  <button
                    className="text-white bg-biru font-bold rounded-xl p-2"
                    onClick={handleToRegister}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
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

export default Navbar;
