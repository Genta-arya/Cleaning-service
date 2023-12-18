import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import BottomSheet from "./BottomSheet";

const Navbar = () => {
  const notificationCount = 0;

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
            {notificationCount >= 0 && (
              <span className="bg-red-500 text-white rounded-full absolute -top-3 right-12 px-2 py-1 text-xs">
                {notificationCount}
              </span>
            )}
            <FontAwesomeIcon
              icon={faBell}
              className="text-2xl cursor-pointer hover:text-gray-300"
            />
            <FontAwesomeIcon
              icon={faUser}
              className="text-2xl cursor-pointer hover:text-gray-300"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
