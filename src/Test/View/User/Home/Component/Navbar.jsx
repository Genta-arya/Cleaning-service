import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import BottomSheet from "./BottomSheet";
import { handleLogout, logout } from "../../../../../Service/Api";
import { selectIsAuthenticated } from "../../../../../Feature/Redux/Auth/AuthSlice";
import { useSelector } from "react-redux";

const Navbar = () => {
  const notificationCount = 0;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
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

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-sm font-bold">Our Website</div>

        <div className="lg:hidden md:hidden block">
          <BottomSheet />
        </div>

        <div className="lg:block md:block hidden">
          <div className="flex space-x-4 gap-8 relative">
            <FontAwesomeIcon
              icon={faClipboardList}
              className="text-2xl cursor-pointer hover:text-gray-300"
            />
            {notificationCount > 0 && (
              <span className="bg-red-500 text-white rounded-full absolute -top-3 right-12 px-2 py-1 text-xs">
                {notificationCount}
              </span>
            )}
            <FontAwesomeIcon
              icon={faBell}
              className="text-2xl cursor-pointer hover:text-gray-300"
            />

            <div className="relative inline-block" ref={dropdownRef}>
              <FontAwesomeIcon
                icon={faUser}
                className={`text-2xl cursor-pointer hover:text-gray-300 ${
                  isDropdownOpen ? "text-green-500" : ""
                }`}
                onClick={() => {
                  // Hanya membuka dropdown jika pengguna terautentikasi
                  if (isAuthenticated) {
                    setDropdownOpen(!isDropdownOpen);
                  }
                }}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black p-2 rounded-md shadow-md">
                  <div onClick={() => console.log("Profile clicked")} className="cursor-pointer">
                    Profile
                  </div>
                  <div onClick={handleLogout} className="cursor-pointer">Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
