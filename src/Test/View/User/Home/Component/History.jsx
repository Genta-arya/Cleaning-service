import React, { useEffect, useState } from "react";
import { getHistory } from "../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  console.log(historyData);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleWhatsAppChat = (phoneNumber, orderDetails) => {
    const message =
      `Hi, Saya sudah order. Tolong konfirmasi pesanan dengan detail berikut:\n\n` +
      `nama: ${orderDetails.name}\n` +
      `Produk: ${orderDetails.nm_product}\n` +
      `Jumlah: ${orderDetails.qty}\n` +
      `Total Harga: Rp ${orderDetails.price.toLocaleString()}\n\n` +
      `Terima kasih!`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  const handleSortingChange = (criteria) => {
    setSortingCriteria(criteria);
  };
  const handleBack = () =>{
    navigate("/")
  }

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const sortData = (data) => {
    if (sortingCriteria === "status") {
      return data.sort((a, b) => {
        if (a.orderDetails.status < b.orderDetails.status) return -1;
        if (a.orderDetails.status > b.orderDetails.status) return 1;
        return 0;
      });
    }

    return sortingCriteria === "latest" ? data.reverse() : data;
  };

  const filterData = (data) => {
    if (filterStatus === "all") {
      return data;
    }
    return data.filter((order) => order.orderDetails.status === filterStatus);
  };

  const sortedAndFilteredData = filterData(sortData(historyData));

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-4 hidden lg:block md:block">
        Pesanan
      </h2>
      <div className="hidden lg:block md:block">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Service</th>
                <th>Total Price</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredData.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="flex justify-center">
                      <img
                        src={
                          order.orderDetails.url ||
                          "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                        }
                        alt="image"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td>
                    <div className="text-gray-700">
                      Quantity: {order.orderDetails.qty} x{" "}
                      {order.orderDetails.nm_product}
                    </div>
                  </td>
                  <td>Rp {order.orderDetails.price.toLocaleString()}</td>
                  <td>
                    {order.orderDetails.createdAt &&
                      new Date(order.orderDetails.createdAt).toLocaleString()}
                  </td>

                  <td
                    className={`${
                      order.orderDetails.status === "pending"
                        ? "text-orange-500"
                        : order.orderDetails.status === "selesai"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {order.orderDetails.status === "pending"
                      ? "diproses"
                      : order.orderDetails.status}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleWhatsAppChat("6287762689648", order.orderDetails)
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      <span className="mr-2">&#x1F4AC;</span>Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* mobile view */}
      <div className="lg:hidden md:hidden block p-2">
        <div className="flex justify-between mx-auto ">
          <FontAwesomeIcon icon={faArrowLeft} size="lg" onClick={handleBack} className="cursor-pointer"></FontAwesomeIcon>
          <h2 className="font-semibold mb-4 text-xl">Pesanan</h2>
        </div>

        <div className="mb-4 p-2">
          <label className="mr-2">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        {sortedAndFilteredData.map((order) => (
          <div
            key={order.id}
            className={`bg-white shadow-md rounded-md p-6 mb-4`}
          >
            <h3 className="text-lg font-semibold mb-2">{order.createdAt}</h3>

            <div className="flex justify-center">
              <img src={order.orderDetails.url} alt="image" />
            </div>

            <div className="text-gray-700">
              Quantity: {order.orderDetails.qty} x{" "}
              {order.orderDetails.nm_product} - Rp{" "}
              {order.orderDetails.price.toLocaleString()}
            </div>

            <div className="flex items-center mx-auto justify-between">
              <p className="mt-2 text-gray-800 font-bold">
                Total: Rp {order.orderDetails.price.toLocaleString()}
              </p>
              <p
                className={`${
                  order.orderDetails.status === "pending"
                    ? "text-orange-500"
                    : order.orderDetails.status === "selesai"
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {order.orderDetails.status === "pending"
                  ? "diproses"
                  : order.orderDetails.status}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() =>
                  handleWhatsAppChat("6287762689648", order.orderDetails)
                }
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-md items-center"
              >
                <span className="mr-2">&#x1F4AC;</span>Chat via WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedAndFilteredData.length === 0 && (
        <p className="text-center text-gray-600">No order history available.</p>
      )}
    </div>
  );
};

export default History;
