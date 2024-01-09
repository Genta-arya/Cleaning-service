import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../../../../Service/Config";
import Loading from "../Customer/Loading";

const ModalUploadGambar = ({ closeUploadModal, selectedOrderInfo, orders }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const orderIds = orders.map((dataObject) => dataObject.id);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter((file) => {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValid =
        file.type.startsWith("image/") &&
        allowedExtensions.includes(fileExtension);

      if (!isValid) {
        toast.error(
          `File ${file.name} tidak sesuai format. Hanya menerima jpg, jpeg, dan png.`
        );
      }

      return isValid;
    });

    setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleUpload = async () => {
    setLoading(true)
    try {
      const formData = new FormData();

      selectedImages.forEach((image) => {
        formData.append(`thumbnail`, image);
      });

      formData.append("orderDetailId", selectedOrderInfo.id);
      formData.append("orderId", selectedOrderInfo.orderId);
      formData.append("nm_product", selectedOrderInfo.nm_product);

      const response = await axiosInstance.post("/upload/dokument", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Upload successful!");
        closeUploadModal();
        setLoading(false)
      } else if (response.status === 400) {
        toast.error("Client-side error. Check your request.");
        setLoading(false)
      }
    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data.error}`);
        setLoading(false)
      } else if (error.request) {
        toast.error("No response received from the server.");
        setLoading(false)
      } else {
        toast.error("Error setting up the request. Please try again.");
        setLoading(false)
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-auto">
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white w-96 p-6 rounded-md">
          <div className="flex justify-end">
            <button
              onClick={closeUploadModal}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <h2 className="text-lg font-semibold mb-4">Dokumentasi Pengerjaan</h2>

          <form>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Gambar (Maksimal 3)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className={`mt-1 p-2 border rounded-md w-full ${
                  selectedImages.length >= 3 ? "cursor-not-allowed" : ""
                }`}
                disabled={selectedImages.length >= 3}
              />
            </div>

            {selectedImages.length > 0 && (
              <div className="mb-4 flex justify-center border p-2">
                <div className="flex flex-wrap space-x-2 mt-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 right-0 text-black rounded-full cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                disabled={selectedImages.length === 0}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <Loading />
      )}
    </div>
  );
};

export default ModalUploadGambar;
