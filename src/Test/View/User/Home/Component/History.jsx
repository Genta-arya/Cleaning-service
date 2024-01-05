import React, { useEffect, useState } from "react";
import { checkJwt, getHistory } from "../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faL } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import animationData from "../../../../../Asset/Pesanan.json";
import Lottie from "lottie-react";

import SkeletonTable from "./SkeletonTable";
import SkeletonMobile from "./SkeletonMobile";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../../../../Feature/Redux/Auth/AuthSlice";

import jsPDF from "jspdf";
import Modal from "react-modal";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import ViewImage from "../../../Admin/Home/Component/Pesanan/ViewImage";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
Modal.setAppElement("#root");
const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsloading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewImages, setViewImages] = useState([]);
  const [isViewImageModalOpen, setIsViewImageModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchHistory = async () => {
    setIsloading(true);
    try {
      const response = await getHistory(currentPage);

      if (!response || !response.totalPages || !response.orders) {
        setIsloading(false);

        return;
      }

      const { orders, totalPages } = response;

      if (!orders) {
        setIsloading(false);
      }

      setHistoryData(orders);
      setTotalItems(totalPages);

      setIsloading(false);
    } catch (error) {
      console.error("Error fetching history:", error);

      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();
        if (data.success) {
          dispatch(setLoggedIn(true));
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleWhatsAppChat = (phoneNumber, orderDetails) => {
    const message =
      `Hi, Saya sudah order. Tolong konfirmasi pesanan dengan detail berikut:\n\n` +
      `nomor pesanan: ${orderDetails.orderId}\n` +
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
  const handleBack = () => {
    navigate("/");
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const sortData = (data) => {
    if (sortingCriteria === "status") {
      return data.sort((a, b) => {
        if (a.orderDetails && b.orderDetails) {
          if (a.orderDetails.status < b.orderDetails.status) return -1;
          if (a.orderDetails.status > b.orderDetails.status) return 1;
          return 0;
        }
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

  const sortedAndFilteredData = historyData
    ? filterData(sortData(historyData))
    : [];

  const handleDownloadPDF = () => {
    if (sortedAndFilteredData.length === 0) {
      return;
    }
    const username = localStorage.getItem("username");

    const pdf = new jsPDF();
    pdf.text(`History Pesanan , ${username}`, 20, 10);

    const headers = ["Order ID", "Service", "Total Price", "Date", "Status"];

    const data = sortedAndFilteredData.map((order) => [
      order.id,
      order.orderDetails.nm_product,
      `Rp ${order.orderDetails.price.toLocaleString()}`,
      formatDate(new Date(order.orderDetails.createdAt)),
      order.orderDetails.status,
    ]);

    pdf.autoTable({
      startY: 30,
      head: [headers],
      body: data,
    });

    pdf.save("order_history.pdf");
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const handleViewImages = (order) => {
    const images = order.images;

    setViewImages(images);
    setIsViewImageModalOpen(true);
  };

  const handleCloseViewImageModal = () => {
    setIsViewImageModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="hidden lg:block md:block">
        <div className="flex justify-between mx-auto ">
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            onClick={handleBack}
            className="cursor-pointer"
          ></FontAwesomeIcon>
          <h2 className="text-3xl font-semibold mb-4 ">Pesanan</h2>
        </div>
        <div>
          <div className="mb-4 p-8 flex justify-center  ">
            <div className="flex justify-end items-center">
              <label className="mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="p-1 border rounded-md"
              >
                <option value="all">Semua</option>
                <option value="pending">Diproses</option>
                <option value="konfirmasi">Konfirmasi</option>
                <option value="selesai">Selesai</option>
              </select>
              {sortedAndFilteredData.length > 0 && (
                <button
                  className="bg-biru text-white p-2  rounded-xl ml-4 hover:scale-105 delay-95 duration-300"
                  onClick={handleDownloadPDF}
                >
                  <p className="text-sm">Download History</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block md:block">
        <div className="overflow-x-auto">
          <table className="table text-center">
            <thead>
              <tr className="border">
                <th className="border p-2">Id pesanan</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Service</th>
                <th className="border p-2">Total Price</th>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Detail Service</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Layanan</th>
              </tr>
            </thead>

            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonTable key={index} />
              ))
            ) : (
              <tbody>
                {sortedAndFilteredData.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="border p-2">{order.orderDetails.orderId}</td>
                    <td className="border p-2">
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

                    <td className="border p-2">
                      <div className="text-gray-700">
                        Quantity: {order.orderDetails.qty} x{" "}
                        {order.orderDetails.nm_product}
                      </div>
                    </td>

                    <td className="border p-2">
                      Rp {order.orderDetails.price.toLocaleString()}
                    </td>
                    <td>
                      {order.orderDetails.createdAt &&
                        new Date(order.orderDetails.createdAt).toLocaleString()}
                    </td>
                    <td>-</td>
                    <td
                      className={`${
                        order.orderDetails.status === "pending"
                          ? "text-orange-500 border p-2"
                          : order.orderDetails.status === "selesai"
                          ? "text-green-500 border p-2"
                          : "text-blue-500 border p-2"
                      }`}
                    >
                      {order.orderDetails.status === "pending"
                        ? "diproses"
                        : order.orderDetails.status}
                    </td>
                    <td className="border p-2">
                      {order.orderDetails.status === "selesai" ? (
                        <>
                          <div className="flex justify-center gap-2">
                            <button
                              className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
                              disabled
                            >
                              <span className="mr-2">&#x1F4AC;</span>Chat
                            </button>

                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md w-32 ease-in transition-all "
                              onClick={() => {
                                if (order.orderDetails.status === "selesai") {
                                  handleViewImages(order);
                                } else {
                                  toast.error(
                                    "Status pesanan belum selesai. Tidak bisa melihat gambar."
                                  );
                                }
                              }}
                              disabled={order.orderDetails.status !== "selesai"}
                            >
                              <div>
                                <FontAwesomeIcon
                                  icon={faImage}
                                  className="xl"
                                ></FontAwesomeIcon>
                                <h1 className="text-xs">Dokumentasi</h1>
                              </div>
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            handleWhatsAppChat(
                              "6287762689648",
                              order.orderDetails
                            )
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          <span className="mr-2">&#x1F4AC;</span>Chat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          <div className="flex justify-center mt-4"></div>
        </div>
      </div>

      {/* mobile view */}
      <div className="lg:hidden md:hidden block p-4">
        <div className="flex justify-between mx-auto ">
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            onClick={handleBack}
            className="cursor-pointer"
          ></FontAwesomeIcon>
          <h2 className="font-semibold mb-4 text-xl">Pesanan</h2>
        </div>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonMobile key={index} />
          ))
        ) : (
          <div>
            <div className="mb-4 p-2 ">
              <div className="flex justify-end items-center">
                <label className="mr-2">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="p-1 border rounded-md"
                >
                  <option value="all">Semua</option>
                  <option value="pending">Diproses</option>
                  <option value="konfirmasi">Konfirmasi</option>
                  <option value="selesai">Selesai</option>
                </select>

                {sortedAndFilteredData.length > 0 && (
                  <button
                    className="bg-biru text-white p-2  rounded-xl ml-4 hover:scale-105 delay-95 duration-300"
                    onClick={handleDownloadPDF}
                  >
                    <p className="text-sm">Download History</p>
                  </button>
                )}
              </div>
            </div>

            {sortedAndFilteredData.map((order) => (
              <div
                key={order.id}
                className={`bg-white shadow-md  p-8 mb-4 rounded-xl ease-in transition-all w-full hover:scale-105 delay-95 duration-300`}
              >
                <div className="flex justify-around space-x-0">
                  <div className="flex justify-center">
                    <img
                      src={order.orderDetails.url}
                      alt="image"
                      className="w-32 h-auto rounded-lg border-black border-2 shadow-2xl"
                    />
                  </div>

                  <div className="text-gray-700 text-sm">
                    <div>
                      {order.orderDetails.qty} x {order.orderDetails.nm_product}{" "}
                    </div>

                    <div className="text-gray-800 font-bold">
                      <h1 className="font-serif ">
                        Rp {order.orderDetails.price.toLocaleString()}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center mx-auto">
                    <h3 className="font-bold mb-2 flex justify-end  text-xs">
                      <p
                        className={`${
                          order.orderDetails.status === "pending"
                            ? "text-orange-500 border-orange-500 rounded-full border p-1"
                            : order.orderDetails.status === "selesai"
                            ? "text-green-500 border-green-500 rounded-full border p-1"
                            : "text-gray-500"
                        }`}
                      >
                        {order.orderDetails.status === "pending"
                          ? "diproses"
                          : order.orderDetails.status}
                      </p>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col justify-center mt-4 gap-2 ">
                  {order.orderDetails.status === "selesai" ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-biru text-white px-4 py-2 rounded-md ease-in transition-all w-full hover:scale-105 duration-300`"
                          onClick={() => {
                            if (order.orderDetails.status === "selesai") {
                              handleViewImages(order);
                            } else {
                              toast.error(
                                "Status pesanan belum selesai. Tidak bisa melihat gambar."
                              );
                            }
                          }}
                          disabled={order.orderDetails.status !== "selesai"}
                        >
                          <div className="flex justify-center gap-2">
                            <FontAwesomeIcon
                              icon={faImage}
                              className="xl"
                            ></FontAwesomeIcon>
                            <h1 className="text-xs">Dokumentasi</h1>
                          </div>
                        </button>
                        <button
                          className="bg-gray-500 text-white px-4 py-2 rounded-md w-full text-xs"
                          disabled
                        >
                          <span className="mr-2">
                            <FontAwesomeIcon
                              icon={faWhatsapp}
                              size="xl"
                            ></FontAwesomeIcon>
                          </span>
                          WhatsApp
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleWhatsAppChat("6287762689648", order.orderDetails)
                      }
                      className="bg-biru text-white px-4 py-2 rounded-md w-full text-xs ease-in transition-all w-full hover:scale-105 duration-300`"
                    >
                      <span className="mr-2">
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          size="xl"
                        ></FontAwesomeIcon>
                      </span>
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedAndFilteredData.length === 0 && !isLoading && (
        <div className="p-20 lg:p-0">
          <div className="flex justify-center">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay
              className=" w-80 h-80"
            />
          </div>

          <p className="text-gray-700 text-lg mb-4 text-center font-serif ">
            Belum ada Pesanan.
          </p>
        </div>
      )}

      {isViewImageModalOpen && (
        <ViewImage images={viewImages} onClose={handleCloseViewImageModal} />
      )}
      <div className="join flex justify-center mt-4">
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
          disabled={totalItems <= currentPage}
        >
          <p className="text-black font-bold">»</p>
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default History;
