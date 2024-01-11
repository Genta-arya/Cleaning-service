import React, { useState, useEffect } from "react";
import { getVoucherByid } from "../../../../../../Service/Api";
import { motion } from "framer-motion";
import { FaCheckCircle, FaRegClone } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "./Loading";

const ModalViewDiscount = ({ onClose, select }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [copiedIds, setCopiedIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectCategory, setSelectedCategory] = useState("");
  const fetchVoucher = async () => {
    setLoading(true);
    try {
      const response = await getVoucherByid(select);
      setVouchers(
        response.data.filter((voucher) => voucher.status === "active")
      );
      setSelectedCategory(response.data.categories.name)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucher();
    console.log(selectCategory)
  }, [select]);

  const closeModal = () => {
    onClose();
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIds((prevState) => ({ ...prevState, [id]: true }));
    setTimeout(() => {
      setCopiedIds((prevState) => ({ ...prevState, [id]: false }));
    }, 3000);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 flex items-center  justify-center z-50 overflow-auto bg-black bg-opacity-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white w-[40%] mx-auto rounded-lg shadow-lg overflow-y-auto  h-[400px]">
        <div className="py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Voucher</p>
            <div className="cursor-pointer z-50" onClick={closeModal}>
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              {vouchers.length === 0 ? (
                <>
                  <div className="mx-auto flex justify-center ">
                    <h1 className="translate-y-32 text-red-500 font-bold">
                      Belum punya voucher
                    </h1>
                  </div>
                </>
              ) : (
                <div className="mt-5">
                  {vouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="border-b border-gray-200 py-4 hover:bg-gray-200 hover:p-2 hover:rounded-lg"
                    >
                      <div className="flex justify-between">
                        <p className="text-green-500 font-bold">
                          <strong>Status:</strong> {voucher.status}
                        </p>
                        <p className="">
                          <strong>Discount:</strong>{" "}
                          <span className="text-xl text-red-500 font-bold">
                            {voucher.disc * 100}%
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-center ">
                        <div className="border border-orange-500 w-52 p-4 rounded-xl ">
                          <p className="text-2xl flex justify-center cursor-default text-orange-500 font-bold">
                            {voucher.code}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 flex justify-center">
                        <strong>Exp:</strong>{" "}
                        {new Date(voucher.exp).toLocaleDateString()}
                      </p>
                      <div className="flex justify-center mt-2">
                        <button
                          onClick={() =>
                            copyToClipboard(voucher.id, voucher.code)
                          }
                          className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:shadow-outline-blue transition ease-in-out duration-150"
                        >
                          {copiedIds[voucher.id] ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                          ) : (
                            <FaRegClone className="mr-2" />
                          )}{" "}
                          {copiedIds[voucher.id] ? "disalin" : "Salin Voucher"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModalViewDiscount;
