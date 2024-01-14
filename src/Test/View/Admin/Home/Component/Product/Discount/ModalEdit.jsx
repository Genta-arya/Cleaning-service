import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { editDiscountProductByid } from "../../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";

const ModalEdit = ({ onCloses, nm_product, refresh, disc, productId }) => {
  // State variables for form inputs
  const [newDiscount, setNewDiscount] = useState(disc);
  const [expirationDate, setExpirationDate] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDiscount || !expirationDate) {
      toast.error("Mohon isi semua kolom yang diperlukan");
      return;
    }

    try {
      const data = await editDiscountProductByid({
        productId,
        newDiscount,
        expirationDate,
      });

      toast.success("Diskon Berhasil diedit");
      refresh();

      onCloses();
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan perubahan diskon");
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md relative xl:w-[35%] lg:w-[40%]">
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={onCloses}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <form onSubmit={handleSubmit}>
            <h1 className="flex justify-center text-lg font-bold py-4">
              Edit Diskon Produk
            </h1>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Product</label>
              <input
                type="text"
                value={nm_product}
                readOnly
                disabled={true}
                className="border w-full p-2 rounded-lg border-blue-500 px-4 cursor-default"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">
                New Discount
              </label>

              <input
                type="range"
                min={1}
                max={100}
                value={newDiscount}
                onChange={(e) => setNewDiscount(parseInt(e.target.value))}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full flex justify-center text-xs">
              <div className="h-full ">{newDiscount}%</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">Expired</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border w-full p-2 rounded-lg border-blue-500 px-4 focus:outline-none focus:border-blue-700"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ModalEdit;
