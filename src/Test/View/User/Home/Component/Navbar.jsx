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
import { useNavigate } from "react-router-dom";
import logo from "../../../../../Asset/wayan logo.png"

const Navbar = () => {
  const notificationCount = 0;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  console.log(isAuthenticated)

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

  const handleLogoutClick = async () => {
    
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

  return (
    <div className="flex justify-center w-full ">
      <div className="lg:hidden md:hidden block">
        <BottomSheet />
      </div>
      <div className="bg-white p-2 w-[95%] rounded-xl lg:block md:block hidden mt-8">
        <nav className="text-white">
          <div className=" flex justify-between items-center px-12 ">
            <img src={logo} alt="logo-wayan" className="h-20 w-20 object-fill" />
            <div className="lg:block md:block hidden space-x-8  relative items-center">
              {isAuthenticated ? (
                <>
                  {notificationCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full absolute -top-3 right-12 px-2 py-1 text-xs">
                      {notificationCount}
                    </span>
                  )}
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-2xl cursor-pointer hover:text-biru text-biru"
                  />
                  <div className="relative inline-block" ref={dropdownRef}>
                    <FontAwesomeIcon
                      icon={faUser}
                      className={`text-2xl cursor-pointer hover:text-gray-300 text-biru ${isDropdownOpen ? "text-green-500" : ""}`}
                      onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-black  rounded-md shadow-2xl drop-shadow-2xl border-2 border-biru p-1">
                        <div onClick={() => console.log("Profile clicked")} className="cursor-pointer">
                          Profile
                        </div>
                        <div onClick={handleLogoutClick} className="cursor-pointer">Logout</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button className="text-biru font-bold" onClick={handleToLogin}>Login</button>
                  <button className="text-white bg-biru font-bold rounded-xl p-2">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
