import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const BottomSheet = () => {
  const notificationCount = 0;

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-8 shadow-md flex flex-row justify-between z-50 ">
      <div className="flex flex-col items-center text-black">
        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="text-2xl cursor-pointer hover:text-gray-300"
          />
          {notificationCount >= 0 && (
            <span className="bg-red-500 text-white rounded-full absolute  -top-4 -right-4 px-2 py-1 text-xs">
              {notificationCount}
            </span>
          )}
        </div>
        <p className="text-sm mt-1">Notifikasi</p>
      </div>
      <div className="flex flex-col items-center text-black">
        <FontAwesomeIcon
          icon={faClipboardList}
          className="text-2xl cursor-pointer hover:text-gray-300"
        />
        <p className="text-sm mt-1">Pesanan</p>
      </div>
      <div className="flex flex-col items-center text-black">
        <FontAwesomeIcon
          icon={faUser}
          className="text-2xl cursor-pointer hover:text-gray-300"
        />
        <p className="text-sm mt-1">Profil</p>
      </div>
    </div>
  );
};

export default BottomSheet;
