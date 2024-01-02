import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faImage,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import SkeletonRow from "../Product/SkeletonRow";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ModalStatus from "./ModalStatus";
import { ToastContainer, toast } from "react-toastify";

const ManagePesanan = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectStatus, setSelectedStatus] = useState(null);

  const fetchData = async () => {
    try {
      const result = await getAllOrders();
      setOrders(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
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
  console.log(selectStatus);
  return (
    <div className="px-12 p-8">
      {isLoading ? (
        <SkeletonRow />
      ) : (
        <div className="overflow-x-auto">
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
                      <button className="text-green-500 hover:underline">
                        <div>
                          <FontAwesomeIcon
                            icon={faUpload}
                            size="xl"
                            className="text-blue-500"
                          />
                        </div>
                      </button>
                      <button onClick={() => handleDeleteOrder(order.id)}>
                        <FontAwesomeIcon icon={faTrash} size="xl" color="red" />
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
