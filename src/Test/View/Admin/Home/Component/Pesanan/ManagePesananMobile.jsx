import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faEdit,
  faImage,
  faRoad,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ViewImage from "./ViewImage";
import { toast } from "react-toastify";

const ManagePesananMobile = ({
  orders,
  openEditModal,
  handleDeleteOrder,
  handleWhatsAppChat,
  openUploadModal,
  handleViewImages,
  handleCloseViewImageModal,
  isViewImageModalOpen,
  viewImages,
}) => {
  return (
    <>
      <div className=" ">
        <div className="flex flex-col  ">
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                className="border mb-4 p-4 rounded-lg w-[100%]"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-xs">
                    Id Pesanan: {order.id}
                  </div>
                  <div className="flex items-center gap-2">
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
                    <button
                      onClick={() => openEditModal(order)}
                      className="text-blue-500"
                    >
                      <FontAwesomeIcon icon={faEdit} size="lg" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 justify-center p-1">
                  <button
                    className={`text-${
                      order.orderDetails.status === "selesai" ? "blue" : "gray"
                    }-500 hover:underline`}
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
                    <FontAwesomeIcon icon={faImage} size="lg" />
                  </button>

                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => {
                      if (order.orderDetails.status === "selesai") {
                        openUploadModal(
                          order.orderDetails.orderId,
                          order.orderDetails.nm_product,
                          order.id,
                          order.orderDetails.status
                        );
                      } else {
                        toast.error(
                          "Status pesanan belum selesai. Tidak bisa mengunggah gambar."
                        );
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faUpload} size="lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </div>
                <div className="flex  gap-2 items-center mb-2 border p-2 rounded-xl ">
                  <img
                    src={order.orderDetails.url || "default-image-url"}
                    alt="image"
                    className="w-20 h-16 object-cover rounded-md "
                  />
                  <div className="ml-2 items-center text-sm border-b-4 rounded-xl p-2">
                    <div className="mt-3">
                      Nama: {order.orderDetails.username}
                    </div>
                    <div className="">
                      Service: {order.orderDetails.nm_product}
                    </div>
                    <div>Qty: {order.orderDetails.qty}</div>
                    <div>
                      Harga: Rp {order.orderDetails.price.toLocaleString()}
                    </div>
                    <div>
                      Tanggal:{" "}
                      {order.orderDetails.createdAt &&
                        new Date(
                          order.orderDetails.createdAt
                        ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="mb-2 flex justify-center border p-1 rounded-md items-center gap-4">
                  <FontAwesomeIcon icon={faRoad}> </FontAwesomeIcon>
                  {order.location.address},
                </div>

                <div className="mb-2">
                  <a
                    href={`https://www.google.com/maps/place/${order.location.latitude},${order.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    <button className="bg-blue-500 w-full p-1 rounded-md hover:bg-blue-700 ease-in transition-all delay-75">
                      <h1 className="text-white text-sm font-bold">
                        Buka Lokasi
                      </h1>
                    </button>
                  </a>
                </div>
                <div className="flex gap-4 items-center mb-4 ">
                  <button
                    onClick={() => handleWhatsAppChat(order)}
                    className="text-green-500  bg-gray-200 w-full rounded-md p-1 ease-in transition-all delay-75 hover:bg-gray-300"
                  >
                    <div className="flex justify-center gap-2 items-center ">
                      <h1>WhatsApp</h1>
                      <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ManagePesananMobile;
