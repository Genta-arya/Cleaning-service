import React, { useEffect, useState } from "react";
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
import { getHistory, logout } from "../../../../../Service/Api";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../../../../Feature/Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import ModalNotifikasi from "./ModalNotifikasi";
import { PulseLoader } from "react-spinners";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
} from "firebase/database";


import { toast } from "react-toastify";
import { firebaseApp } from "../../../../../Feature/Firebase/FirebaseConfig";

const BottomSheet = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [orderIdFromHistory, setOrderIdFromHistory] = useState([]);
  const [url, setUrl] = useState([]);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setNotificationModalOpen(false);
  };
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

  const handleLogout = async () => {
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
        toast.error("Gagal logout");
        setIsloading(false);
      }
    } catch (error) {
      toast.error("Error:", error);
      setIsloading(false);
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
            <div className="relative " onClick={handleNotificationClick}>
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
      {isNotificationModalOpen && (
        <ModalNotifikasi
          onClose={closeNotificationModal}
          notifications={notifications}
          loading={isLoading}
          image={url}
          orderIdFromHistory={orderIdFromHistory}
        />
      )}

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

export default BottomSheet;
