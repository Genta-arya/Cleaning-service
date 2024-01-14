import React, { useState } from "react";
import { CreatedDiscountProduct } from "../../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../Customer/Loading";

const ModalDiscountProduct = ({ productId, onClose }) => {
  const [discountPercentage, setDiscountPercentage] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoadingg] = useState(false);
  const id = productId.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingg(true);
    let tempErrors = {};
    if (discountPercentage <= 0) {
      tempErrors["discountPercentage"] = "Diskon harus lebih dari 0";
      setLoadingg(false);
    }
    if (!expirationDate) {
      tempErrors["expirationDate"] = "Tanggal kadaluarsa harus diisi";
      setLoadingg(false);
    }
    if (Object.keys(tempErrors).length === 0) {
      try {
        const data = await CreatedDiscountProduct(
          id,
          discountPercentage,
          expirationDate
        );

        setLoadingg(true);

        onClose();
        toast.success("Diskon Berhasil Ditambahkan");
      } catch (error) {

        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Terjadi kesalahan pada server");
        }
      } finally {
        setLoadingg(false);
      }
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form
            onSubmit={handleSubmit}
            className="relative z-10 max-w-lg w-[90%] mx-auto my-10 p-6 space-y-6 bg-white rounded-md shadow-md"
          >
            <FontAwesomeIcon
              icon={faTimes}
              onClick={onClose}
              className="absolute top-4 right-4 "
            />
            <h1 className="text-2xl font-bold mb-4">Tambah Diskon Produk</h1>
            <div>
              <h1 className="text-sm mb-1"> Nama Produk</h1>

              <label htmlFor="disc" className="sr-only">
                Nama Produk
              </label>
              <input
                type="text"
                id="disc"
                name="disc"
                value={productId.nm_product}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 cursor-default"
              />
            </div>

            <div>
              <h1 className="text-sm mb-1">Expired</h1>
              <label htmlFor="exp" className="sr-only cursor-pointer">
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                id="exp"
                name="exp"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 cursor-pointer"
              />
            </div>

            <div>
              <h1 className="text-sm mb-1 ">Discount (%)</h1>
              <label htmlFor="disc" className="sr-only">
                Persentase Diskon
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={discountPercentage}
                onChange={(e) =>
                  setDiscountPercentage(parseInt(e.target.value))
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-full flex justify-center text-xs">
              <div className="h-full ">{discountPercentage}%</div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Buat Diskon
            </button>
          </form>
        </div>
      </div>
      {loading && <Loading />}
      <ToastContainer />
    </div>
  );
};

export default ModalDiscountProduct;
