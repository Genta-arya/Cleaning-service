import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animationData from "../../../../../Asset/notif.json";
import Lottie from "lottie-react";
import { getNotifications } from "../../../../../Service/Api";
import { child, getDatabase, ref, remove } from "firebase/database";
import firebaseApp from "../../../../../Feature/Firebase/FirebaseConfig";

const ModalNotifikasi = ({ onClose, notifications, loading }) => {
  const handleNotificationClick = async (orderId) => {
    try {
      const database = getDatabase(firebaseApp);
      const notificationsRef = ref(database, "notifications");
      const orderIdRef = child(notificationsRef, orderId.toString());

      await remove(orderIdRef);
    } catch (error) {
      console.error("Error clearing notifications:", error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white w-96 p-12 rounded-md shadow-lg z-50 animate__animated animate__fadeIn">
        <div className="flex justify-end" onClick={onClose}>
          <button className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <h1 className="border-b-2 border-gray-400 p-2 font-bold rounded-full">
            Pemberitahuan
          </h1>
        </div>

        <div className="max-h-48 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-4 w-52">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ) : (
            <>
              {notifications.length === 0 ? (
                <>
                  <div className="flex justify-center mb-4">
                    <Lottie
                      animationData={animationData}
                      loop
                      autoplay
                      className="-mb-16"
                    />
                  </div>

                  <p className="text-gray-700 text-sm mb-4 mt-4 text-center font-serif">
                    Belum ada pemberitahuan untukmu.
                  </p>
                </>
              ) : (
                <ul className="list-none">
                  {notifications.map((notification, index) => (
                    <li
                      key={notification.orderId}
                      className={`bg-gray-100 p-4 mb-2 rounded-md ${
                        index % 2 === 0 ? "bg-gray-200" : ""
                      } animate__animated animate__fadeIn`}
                    >
                      <Link
                        to="/history"
                        onClick={() =>
                          handleNotificationClick(notification.orderId)
                        }
                        className="cursor-pointer"
                      >
                        {notification.message}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalNotifikasi;
