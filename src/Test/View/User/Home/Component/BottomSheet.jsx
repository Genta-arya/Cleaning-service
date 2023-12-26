import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faBell,
  faUser,
  faToggleOff,
  faPowerOff,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../../../../Service/Api";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../../../Feature/Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";

const BottomSheet = () => {
  const notificationCount = 0;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const handleLogout = async () => {
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

        window.location.href = "/";
      } else {
        console.error("Gagal logout");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleToLogin = () => {
    navigate("/login");
  };
  const handleHistory = () => {
    navigate("/history");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-md flex flex-row justify-around z-50 ">
      <div className="flex flex-col items-center text-black">
        {isAuthenticated ? (
          <>
            <div className="relative">
              <FontAwesomeIcon
                icon={faBell}
                className="text-2xl cursor-pointer hover:text-gelap text-biru"
              />
              {notificationCount >= 0 && (
                <span className="bg-red-500 text-white rounded-full absolute  -top-4 -right-4 px-2 py-1 text-xs z-auto">
                  {notificationCount}
                </span>
              )}
            </div>
            <p className="text-xs text-biru mt-1">Notifikasi</p>
          </>
        ) : (
          <>
            <div className="relative">
              <FontAwesomeIcon
                icon={faBell}
                className="text-2xl   text-gray-500"
              />
              {notificationCount >= 0 && (
                <span className="bg-red-500 text-white rounded-full absolute  -top-4 -right-4 px-2 py-1 text-xs z-auto">
                  {notificationCount}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Notifikasi</p>
          </>
        )}
      </div>
      {isAuthenticated ? (
        <div
          className="flex flex-col items-center text-black"
          onClick={handleHistory}
        >
          <FontAwesomeIcon
            icon={faClipboard}
            className="text-2xl cursor-pointer text-biru"
          />
          <p className="text-xs mt-1 text-biru">Pesanan</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-black">
          <FontAwesomeIcon
            icon={faClipboard}
            className="text-2xl  text-gray-500"
          />
          <p className="text-xs text-gray-500  mt-1">Pesanan</p>
        </div>
      )}
      {isAuthenticated ? (
        <div
          className="flex flex-col items-center text-black"
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faPowerOff}
            className="text-2xl cursor-pointer text-red-600"
          />
          <p className="text-xs mt-1 text-red-600">Logout</p>
        </div>
      ) : (
        <div
          className="flex flex-col items-center text-black"
          onClick={handleToLogin}
        >
          <FontAwesomeIcon
            icon={faUser}
            className="text-2xl cursor-pointer text-biru"
          />
          <p className="text-xs text-biru mt-1">Login</p>
        </div>
      )}
    </div>
  );
};

export default BottomSheet;
