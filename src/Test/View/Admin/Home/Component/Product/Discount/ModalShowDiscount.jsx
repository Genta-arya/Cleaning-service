import React, { useState, useEffect } from "react";
import { getDiscountProductByid } from "../../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../Customer/Loading";
import ModalEdit from "./ModalEdit";
import ErrorLayout from "../../../../../User/404/ErrorLayout";

const ModalEditDiscount = ({ productId, onClose, refresh }) => {
  const [discountProduct, setDiscountProduct] = useState({});
  const [discountPercentage, setDiscountPercentage] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [openModal, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const beforePrice = productId.price;
  const disc = discountPercentage / 100;
  const [error, setError] = useState(false);
  const total = beforePrice - beforePrice * disc;

  useEffect(() => {
    setIsLoading(true);
    const fetchDiscountProduct = async () => {
      try {
        const response = await getDiscountProductByid(productId.id);
        setDiscountProduct(response.data);
        setDiscountPercentage(response.data.discountPercentage);
        setExpirationDate(response.data.expirationDate);
      } catch (error) {
        console.log(error);
        toast.error("terjadi kesalahan pada server");
        setError(true);
      } finally {
        setIsLoading(false);
        setError(false);
      }
    };
    fetchDiscountProduct();
  }, [productId]);

  const OpenModals = () => {
    setIsModalOpen(true);
  };

  const CloseModal = () => {
    setIsModalOpen(false);
  };

  const formatExpirationDate = (rawDate) => {
    const date = new Date(rawDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatCurrency = (price) => {
    return `Rp ${price.toLocaleString()}`;
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md relative xl:w-[35%] lg:w-[40%]">
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {loading ? (
            <Loading />
          ) : (
            <>
              {error ? (
                <>
                  {discountProduct ? (
                    <div className="">
                      <h1 className="flex justify-center text-lg  py-4 font-bold">
                        Detail Diskon
                      </h1>
                      <h2 className="m-1">Produk</h2>
                      <input
                        value={productId.nm_product}
                        className="border w-full p-1 rounded-lg border-biru px-4 cursor-default"
                      ></input>

                      <h1 className="m-1">Harga</h1>

                      <input
                        value={formatCurrency(total)}
                        className="border w-full p-1 rounded-lg border-biru px-4 cursor-default"
                      ></input>
                      <p className="m-1">Diskon:</p>
                      <input
                        value={discountProduct.discountPercentage + " %"}
                        className="border w-full p-1 rounded-lg border-biru px-4 cursor-default"
                      ></input>
                      <p className="text-xs  flex justify-center  m-2  text-gray-500 mb-4 cursor-default">
                        Exp:{" "}
                        {formatExpirationDate(discountProduct.expirationDate)}
                      </p>

                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                        onClick={OpenModals}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center text-red-500">
                      Produk ini belum memiliki diskon
                    </div>
                  )}
                </>
              ) : (
                <>
                  <ErrorLayout />
                </>
              )}
            </>
          )}
        </div>
      </div>
      {openModal && (
        <ModalEdit
          onCloses={CloseModal}
          nm_product={productId.nm_product}
          disc={discountPercentage}
          exp={expirationDate}
          productId={productId.id}
          refresh={refresh}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ModalEditDiscount;
