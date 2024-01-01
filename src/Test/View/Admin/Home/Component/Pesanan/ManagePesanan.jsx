import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import SkeletonRow from "../Product/SkeletonRow";

const ManagePesanan = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
  }, []);

  const handleEditStatus = async (orderId, newStatus) => {
    try {
    } catch (error) {
      console.error("Error editing order status:", error);
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
        // Format the phone number to international format
        const formattedTelp = telp.replace(/^0/, "62"); // Replace leading 0 with country code 62

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
                  <td
                    className={`${
                      order.orderDetails.status === "pending"
                        ? "text-orange-500 border border-gray-300 p-2 font-bold"
                        : order.orderDetails.status === "selesai"
                        ? "text-green-500 border border-gray-300 p-2 font-bold"
                        : "text-gray-500 border border-gray-300 p-2 font-bold"
                    }`}
                  >
                    {order.orderDetails.status === "pending"
                      ? "diproses"
                      : order.orderDetails.status}
                  </td>

                  <td className="border border-gray-300 p-2">
                    <div className="flex gap-4 p-4">
                      <button
                        onClick={() => handleEditStatus(order.id, "newStatus")}
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="xl"
                          className="text-blue-500 "
                        />
                      </button>
                      <button onClick={() => handleDeleteOrder(order.id)}>
                        <FontAwesomeIcon icon={faTrash} size="xl" color="red" />
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleWhatsAppChat(order)}
                      className="text-green-500 hover:underline"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePesanan;
