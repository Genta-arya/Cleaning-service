import React, { useEffect, useState } from "react";
import { checkJwt, getHistory } from "../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage, faL } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import animationData from "../../../../../Asset/Pesanan.json";
import Lottie from "lottie-react";
import TurndownService from "turndown";
import SkeletonTable from "./SkeletonTable";
import SkeletonMobile from "./SkeletonMobile";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../../../../../Feature/Redux/Auth/AuthSlice";
import parse from "html-react-parser";
import jsPDF from "jspdf";
import Modal from "react-modal";
import "jspdf-autotable";
import DOMPurify from "dompurify";
import { ToastContainer, toast } from "react-toastify";
import ViewImage from "../../../Admin/Home/Component/Pesanan/ViewImage";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  const turndownService = new TurndownService();

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
    <div className="container mx-auto mt-8 p-4 ">
      <div className="hidden lg:block md:block ">
        <div className="flex justify-between mx-auto ">
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="lg"
            onClick={handleBack}
            className="cursor-pointer"
          ></FontAwesomeIcon>
        </div>
      </div>

      <div className="hidden lg:block md:block">
        <div className="">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonMobile key={index} />
            ))
          ) : (
            <div>
              <div className="mb-4 p-2 ">
                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-3xl font-semibold mb-4 ">Pesanan</h2>

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

              {sortedAndFilteredData.map((order) => (
                <div className="bg-gray-200 p-8 rounded-lg py-2 ">
                  <div
                    key={order.id}
                    className={`bg-white shadow-md  mx-auto p-4   rounded-lg space-y-4 w-[75%] `}
                  >
                    <div className="flex items-center justify-between p-1 mx-auto border-b border-gray-300">
                      <h1 className="text-gray-400 ">
                        {order.orderDetails.createdAt &&
                          new Date(order.orderDetails.createdAt)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")}
                      </h1>

                      <h3 className="font-bold mb-2 flex justify-end text-xs">
                        <p
                          className={`${
                            order.orderDetails.status === "pending"
                              ? "text-orange-500 border-orange-500 rounded-full border p-1"
                              : order.orderDetails.status === "selesai"
                              ? "text-green-500 border-green-500 rounded-full border p-1"
                              : order.orderDetails.status === "konfirmasi"
                              ? "text-blue-500 border-blue-500 rounded-full border p-1"
                              : "text-gray-500"
                          }`}
                        >
                          {order.orderDetails.status === "pending"
                            ? "diproses"
                            : order.orderDetails.status}
                        </p>
                      </h3>
                    </div>
                    <div className="flex px-8  border-b border-gray-300 space-x-7">
                      <div className="flex justify-center mb-4  ">
                        <img
                          src={order.orderDetails.url}
                          alt="image"
                          className="w-32 h-auto rounded-lg border-black border-2 shadow-2xl"
                        />
                      </div>

                      <div className="text-gray-700 text-base">
                        {order.orderDetails.nm_product}{" "}
                        <div>x {order.orderDetails.qty}</div>
                      </div>
                    </div>
                    {/* <div className="text-gray-700 text-sm px-4">
                      Keterangan:
                      <span className="flex flex-col text-orange-500">
                        {typeof order.orderDetails.desc === "string"
                          ? parse(order.orderDetails.desc)
                          : typeof order.orderDetails.desc === "object"
                          ? parse(JSON.stringify(order.orderDetails.desc))
                          : "-"}
                      </span>

                    </div> */}
                    <div>
                      <div className="text-gray-700 text-sm px-4">
                        Keterangan:
                      </div>
                      <ReactQuill
                        value={order.orderDetails.desc}
                        readOnly={true}
                        className="text-orange-500"
                        theme={"bubble"}
                      />
                    </div>

                    <div className="text-gray-800 font-bold flex justify-end">
                      <h1 className="font-serif ">
                        <span className="text-xs">Total :</span>
                        <span className="text-green-500">
                          {" "}
                          Rp {order.orderDetails.price.toLocaleString()}
                        </span>
                      </h1>
                    </div>

                    <div className="flex flex-col justify-center mt-4 gap-2 ">
                      {order.orderDetails.status === "selesai" ? (
                        <>
                          <div className="flex  gap-2">
                            <button
                              className="bg-biru text-white px-4 py-2 rounded-md ease-in transition-all w-full hover:scale-95 duration-500"
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
                        <div className="flex  gap-2">
                          <button className="bg-gray-500 text-white px-4 py-2 rounded-md  w-full cursor-default">
                            <div className="flex justify-center gap-2">
                              <FontAwesomeIcon
                                icon={faImage}
                                className="xl"
                              ></FontAwesomeIcon>
                              <h1 className="text-xs">Dokumentasi</h1>
                            </div>
                          </button>
                          <button
                            onClick={() =>
                              handleWhatsAppChat(
                                "6287762689648",
                                order.orderDetails
                              )
                            }
                            className="bg-biru text-white px-4 py-2 rounded-md  text-xs ease-in transition-all w-full hover:scale-95 duration-500"
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <div className="flex justify-between text-xs text-gray-400 border-b border-gray-400 ">
                  <h1>
                    {order.orderDetails.createdAt &&
                      new Date(order.orderDetails.createdAt)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .replace(/\//g, "-")}
                  </h1>
                  <h3 className="font-bold mb-2 text-xs">
                    <p
                      className={`${
                        order.orderDetails.status === "pending"
                          ? "text-orange-500 border-orange-500 rounded-full border p-1"
                          : order.orderDetails.status === "selesai"
                          ? "text-green-500 border-green-500 rounded-full border p-1"
                          : order.orderDetails.status === "konfirmasi"
                          ? "text-blue-500 border-blue-500 rounded-full border p-1"
                          : "text-gray-500"
                      }`}
                    >
                      {order.orderDetails.status === "pending"
                        ? "diproses"
                        : order.orderDetails.status}
                    </p>
                  </h3>
                </div>
                <div className="flex justify-start  gap-2 border-b border-gray-400 mt-4  ">
                  <div className="flex mb-4 ">
                    <img
                      src={order.orderDetails.url}
                      alt="image"
                      className="w-32 h-auto rounded-lg border-black border-2 shadow-2xl"
                    />
                  </div>

                  <div className="text-gray-700 text-sm ">
                    <div className="text-gray-700 text-base">
                      {order.orderDetails.nm_product}
                    </div>
                    <div>x {order.orderDetails.qty}</div>
                  </div>
                </div>
                <div className="">
                  <div className="text-gray-700 text-sm px-4">Keterangan:</div>
                  <ReactQuill
                    value={order.orderDetails.desc}
                    readOnly={true}
                    className="text-orange-500 border-b border-gray-400 "
                    theme={"bubble"}
                  />
                </div>

                <div className="text-gray-800 font-bold text-sm justify-end flex mt-1">
                  <h1 className="font-serif ">
                    <span className="text-xs">Total :</span>
                    <span className="text-green-500">
                      {" "}
                      Rp {order.orderDetails.price.toLocaleString()}
                    </span>
                  </h1>
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
      <div className="join flex justify-center mt-2 mb-4">
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
