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
  faTicketAlt,
  faTicketSimple,
} from "@fortawesome/free-solid-svg-icons";
import { getNotifications, logout } from "../../../../../Service/Api";
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
import Loading from "../../../Admin/Home/Component/Customer/Loading";
import ModalViewDiscount from "../../../Admin/Home/Component/Customer/ModalViewDiscount";

const BottomSheet = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [orderIdFromHistory, setOrderIdFromHistory] = useState([]);
  const [url, setUrl] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [voucher, setNotifVoucher] = useState([]);
  const [openModal, selectOpenModal] = useState(false);
  const handleNotificationClick = () => {
    setNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setNotificationModalOpen(false);
  };
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const username = localStorage.getItem("username");

        if (username) {
          const orders = await getNotifications(username);

          const orderIds = orders.map((order) => order.orderId);

          setOrderIdFromHistory(orderIds);
          return;
        }
      } catch (error) {}
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

  useEffect(() => {
    try {
      const database = getDatabase(firebaseApp);
      const usernameRef = ref(database, `voucher`);

      const unsubscribe = onValue(usernameRef, (snapshot) => {
        const notificationData = snapshot.val();

        if (notificationData) {
          const processedNotifications = Object.entries(notificationData)
            .map(([username, voucherDetails]) => {
              const parts = username.split("-");
              const filteredCode = parts[0];
              return {
                username: filteredCode,
                message: voucherDetails.message || "",
              };
            })
            .filter((voucher) => voucher.username.includes(username));

          setNotifVoucher(processedNotifications);
        } else {
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Error fetching vouchers:", error.message);
    }
  }, [username]);

  const VoucherCount = voucher.length;

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

  const handleOpenVoucher = () => {
    selectOpenModal(true);
  };
  const handlleCloseModal = () => {
    selectOpenModal(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-md flex flex-row justify-around z-50 items-center ">
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

      <div className="flex flex-col items-center text-black">
        {isAuthenticated ? (
          <>
            <div className="relative " onClick={handleOpenVoucher}>
              <FontAwesomeIcon
                icon={faTicketSimple}
                className="text-2xl cursor-pointer hover:text-gelap text-biru"
              />
            </div>
            <p className="text-xs text-biru mt-1">Voucher</p>
          </>
        ) : (
          <>
            <div className="relative">
              <FontAwesomeIcon
                icon={faTicketSimple}
                className="text-2xl   text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Voucher</p>
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
            className="text-2xl cursor-pointer text-biru hover:text-gelap text-biru"
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
          <Loading />
        </div>
      )}
      {openModal && (
        <ModalViewDiscount select={username} onClose={handlleCloseModal} />
      )}
    </div>
  );
};

export default BottomSheet;
