import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  logout,
} from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faImage,
  faLocation,
  faMapLocation,
  faMapPin,
  faMarker,
  faRoad,
  faSignOut,
  faTimes,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonRow from "../Product/SkeletonRow";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ModalStatus from "./ModalStatus";
import { ToastContainer, toast } from "react-toastify";
import animationData from "../../../../../../Asset/new.json";
import image from "../../../../../../Asset/wayan logo.png";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { firebaseApp } from "../../../../../../Feature/Firebase/FirebaseConfig";
import { getDatabase, off, onValue, ref, remove } from "firebase/database";
import { set } from "date-fns";
import Lottie from "lottie-react";
import ManagePesananMobile from "./ManagePesananMobile";
import ModalUploadGambar from "./ModalUploadGambar";

const ManagePesanan = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpload, setIsModaUpload] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const [isNewOrderModalVisible, setIsNewOrderModalVisible] = useState(false);
  const fetchData = async () => {
    try {
      const result = await getAllOrders(currentPage);
      setOrders(result.data.data);
      setTotalPages(result.data.totalPages);
      setCurrentPage(result.data.currentPage);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const storedDataLength = localStorage.getItem("firebaseDataLength");
    const parsedStoredDataLength = storedDataLength
      ? parseInt(storedDataLength, 10)
      : 0;

    const ordersRef = ref(getDatabase(firebaseApp), "pesanan");

    const handleNewData = (snapshot) => {
      const newData = snapshot.val();

      if (newData) {
        const newDataLength = Object.keys(newData).length;

        if (parsedStoredDataLength < newDataLength) {
          setIsNewOrderModalVisible(true);
          fetchData();

          localStorage.removeItem("firebaseDataLength");
        }
      }
    };

    onValue(ordersRef, handleNewData);

    return () => {
      off(ordersRef, "value", handleNewData);
    };
  }, []);

  const handleEditStatus = async (orderId, newStatus, refetchOrders) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus);

      if (response.success) {
        toast.success(response.message);

        fetchData();
      } else {
        toast.error(`Failed to update order status: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error editing order status: ${error.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  const handleWhatsAppChat = (order) => {
    if (order && order.orderDetails) {
      const { name, telp, id } = order.orderDetails;
      const { address, latitude, longitude } = order.location;
      const { nm_product, qty, price } = order.orderDetails;

      if (telp) {
        const formattedTelp = telp.replace(/^0/, "62");

        const message = `Hallo ${name}, saya mau konfirmasi untuk pemesanan Jasa ${nm_product} apakah semua data ini sudah benar?\nPastikan alamatnya juga sudah benar ya.\nOrder ID: ${id}\nAlamat: ${address},\nKoordinat: ${latitude}, ${longitude}\nPesanan: ${qty} x ${nm_product}\nHarga: Rp ${price.toLocaleString()}\nTrimakasih`;

        window.open(
          `https://wa.me/${formattedTelp}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      } else {
        console.error("Phone number is not available for this order.");
      }
    } else {
      console.error("Invalid order data.");
    }
  };

  const openEditModal = (orderId) => {
    setSelectedOrderId(orderId.orderDetails.orderId);
    setSelectedStatus(orderId.orderDetails.status);

    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setSelectedOrderId(null);
    setEditedStatus("");
    setIsModalVisible(false);
  };
  const SkeletonItem = () => (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center gap-4 w-52">
        <div className="skeleton h-32 w-full mb-4 mt-4"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );

  const handleLogoutClick = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      setIsLoadingLogout(true);

      if (!accessToken || !username) {
        console.error("Token or username not found in localStorage");
        return;
      }

      const response = await logout(accessToken, username);

      if (response && response.data && response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setIsLoadingLogout(false);
        navigate("/login");
        window.location.reload();
      } else {
        console.error("Gagal logout");
      }
    } catch (error) {
      setIsLoadingLogout(false);
    }
  };

  const handleCloseModal = () => {
    setIsNewOrderModalVisible(false);

    const pesananRef = ref(getDatabase(firebaseApp), "pesanan");
    remove(pesananRef)
      .then(() => {})
      .catch((error) => {});
  };

  const openUploadModal = (orderId) => {
    setIsModaUpload(true);
  };

  const closeUploadModal = () => {
    setIsModaUpload(false);
  };

  return (
    <div className="px-12 p-8">
      <div className="flex justify-between items-center w-auto bg-white p-4 mb-4 rounded-full lg:hidden md:hidden block">
        <img src={image} alt="image" className="w-10 h-10" />

        <h1 className="font-bold text-biru ">Pesanan</h1>
        <h1 className="cursor-pointer " onClick={handleLogoutClick}>
          <FontAwesomeIcon
            icon={faSignOut}
            className="text-red-500 hover:text-red-700"
          ></FontAwesomeIcon>
        </h1>
      </div>

      <div className="join flex justify-center py-4">
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <p className="text-black font-bold">«</p>
        </button>
        <h1 className="join-item btn cursor-default">{currentPage}</h1>
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <p className="text-black font-bold">»</p>
        </button>
      </div>
      {isLoading ? (
        <>
          <div className="lg:block md:block hidden">
            <SkeletonRow />
          </div>
          <div className="lg:hidden md:hidden block">
            {[...Array(3)].map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </div>
        </>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-center text-red-500">Belum Ada Pesanan</p>
      ) : (
        <>
          <div className="overflow-x-auto lg:block md:block hidden">
            <table className="table table-xs">
              <thead>
                <tr className="text-center">
                  <th className="border border-gray-300 p-2">Id pesanan</th>
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">Image</th>
                  <th className="border border-gray-300 p-2">Service</th>
                  <th className="border border-gray-300 p-2">Total Price</th>
                  <th className="border border-gray-300 p-2">Tanggal</th>
                  <th className="border border-gray-300 p-2">Alamat</th>
                  <th className="border border-gray-300 p-2">Koordinat</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                  <th className="border border-gray-300 p-2">Dokumentasi</th>
                  <th className="border border-gray-300 p-2">Chat</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100 text-center">
                    <td className="border border-gray-300 p-2">{order.id}</td>
                    <td className="border border-gray-300 p-2">
                      {order.username}
                    </td>

                    <td className="border border-gray-300 p-2">
                      <img
                        src={order.orderDetails.url || "default-image-url"}
                        alt="image"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      Quantity: {order.orderDetails.qty} x{" "}
                      {order.orderDetails.nm_product}
                    </td>
                    <td className="border border-gray-300 p-2">
                      Rp {order.orderDetails.price.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.orderDetails.createdAt &&
                        new Date(order.orderDetails.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {" "}
                      {order.location.address},{" "}
                    </td>
                    <td className="border border-gray-300 p-2 text-blue-500 font-bold">
                      <a
                        href={`https://www.google.com/maps/place/${order.location.latitude},${order.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Open Maps
                      </a>
                    </td>
                    <td className="flex p-6 mt-1 gap-4 items-center text-center  ">
                      <div
                        className="border p-1 rounded-md border-gray-300  flex gap-2 cursor-pointer"
                        onClick={() => openEditModal(order)}
                      >
                        <div
                          className={`${
                            order.orderDetails.status === "pending"
                              ? "text-orange-500  font-bold"
                              : order.orderDetails.status === "selesai"
                              ? "text-green-500  font-bold"
                              : "text-blue-500  font-bold"
                          }`}
                        >
                          {order.orderDetails.status === "pending"
                            ? "diproses"
                            : order.orderDetails.status}
                        </div>
                        <button>
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="xl"
                            className="text-blue-500 "
                          />
                        </button>
                      </div>
                    </td>

                    <td className="border border-gray-300 p-2">
                      <div className="flex gap-4 p-4">
                        <button
                          className="text-green-500 hover:underline"
                          onClick={openUploadModal}
                        >
                          <div>
                            <FontAwesomeIcon
                              icon={faUpload}
                              size="xl"
                              className="text-blue-500"
                            />
                          </div>
                        </button>
                        <button onClick={() => handleDeleteOrder(order.id)}>
                          <FontAwesomeIcon
                            icon={faTrash}
                            size="xl"
                            color="red"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button className="text-green-500 hover:underline">
                        <FontAwesomeIcon
                          icon={faImage}
                          size="xl"
                          className="text-blue-500"
                        />
                        <p>lihat</p>
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleWhatsAppChat(order)}
                        className="text-green-500 hover:underline"
                      >
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          size="2xl"
                          className="text-gre-500"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ManagePesananMobile
            orders={orders}
            handleDeleteOrder={handleDeleteOrder}
            openEditModal={openEditModal}
            handleWhatsAppChat={handleWhatsAppChat}
          />
        </>
      )}

      {isModalUpload && (
        <ModalUploadGambar closeUploadModal={closeUploadModal} />
      )}

      {isLoadingLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-center">
              <PulseLoader color="#5F93C0" size={25} />
            </div>
            <p>Tunggu sebentar</p>
          </div>
        </div>
      )}

      {isNewOrderModalVisible && (
        <>
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 p-4 "
          >
            <div
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white w-96 p-12 rounded-md shadow-lg z-50"
            >
              <div className="flex justify-end">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseModal}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="flex justify-center mb-4 ">
                <Lottie
                  animationData={animationData}
                  loop={false}
                  autoplay
                  className="w-full h-full flex justify-center -z-0"
                />
              </div>

              <div
                onClick={handleCloseModal}
                className="flex justify-center text-lg bg-green-500 text-white p-1 rounded-full cursor-pointer  hover:bg-green-700 -mt-5 z-50"
              >
                Ada Pesanan Baru
              </div>
            </div>
          </div>
        </>
      )}

      {selectedOrderId && (
        <ModalStatus
          isVisible={isModalVisible}
          onClose={closeEditModal}
          onSubmit={(newStatus) => handleEditStatus(selectedOrderId, newStatus)}
          currentStatus={selectStatus}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ManagePesanan;
