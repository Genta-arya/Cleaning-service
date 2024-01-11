import React, { useEffect, useState } from "react";
import {
  createDiscount,
  getAllCategories,
} from "../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import Loading from "./Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const ModalCreatedDisc = ({ onClose, select, username, email }) => {
  const [code, setCode] = useState("");
  const [exp, setExp] = useState("");
  const [status, setStatus] = useState("");
  const [disc, setDisc] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [selectedCategories]);

  const generateDiscountCode = () => {
    const discountCode =
      "tangkas_" + Math.random().toString(36).substring(2, 7);
    setCode(discountCode);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    setSelectedCategories(selectedCategory);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

  

    try {
      const discountData = {
        code,
        exp,
        status,
        disc,
        select,
        email,
        username,
        categoryIds: selectedCategories,
      };
      setLoading(true);
      if (!code || !exp || !status || !disc || !username) {
        toast.error("Semua field harus diisi!");
        console.log(discountData);
        return;
      } else {
        await createDiscount(discountData);

        setLoading(true);
        toast.success("Voucher Berhasil Dikirim");
        onClose();
      }
    } catch (error) {
      toast.error("Terjadi masalah pada server");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AnimatePresence>
      {select && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 overflow-auto"
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <form
            onSubmit={handleSubmit}
            className="relative z-10 max-w-lg w-[90%] mx-auto my-10 p-6 space-y-6 bg-white rounded-md shadow-md"
          >
            <FontAwesomeIcon
              icon={faTimes}
              onClick={onClose}
              className="absolute top-4 right-4 cursor-pointer"
            />
            <h1 className="text-2xl font-bold mb-4">Voucher Discount</h1>
            <div>
              <h1 className="text-sm mb-1">Username</h1>

              <label htmlFor="disc" className="sr-only">
                Username
              </label>
              <input
                type="text"
                id="disc"
                name="disc"
                value={username}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 cursor-pointer"
                placeholder="Klik untuk buat kode diskon"
              />
            </div>

            <div>
              <h1 className="text-sm mb-1">Kode Voucher</h1>

              <label htmlFor="disc" className="sr-only">
                Persentase Diskon
              </label>
              <input
                type="text"
                id="disc"
                name="disc"
                value={code}
                onClick={generateDiscountCode}
                readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 cursor-pointer"
                placeholder="Klik untuk buat kode diskon"
              />
            </div>
            <div>
              <h1 className="text-sm mb-1">Expired</h1>
              <label htmlFor="exp" className="sr-only">
                Tanggal Kadaluarsa
              </label>
              <input
                type="date"
                id="exp"
                name="exp"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <h1 className="text-sm mb-1">Status</h1>
              <label htmlFor="status" className="sr-only">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="">Pilih Status</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div>
              <h1 className="text-sm mb-1">Select Category</h1>
              <select
                value={selectedCategories}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nm_category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1 className="text-sm mb-1 ">Discount (%)</h1>
              <label htmlFor="disc" className="sr-only">
                Persentase Diskon
              </label>
              <input
                type="number"
                min={1}
                max={100}
                id="disc"
                name="disc"
                value={disc}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < 1) {
                    setDisc(1);
                  } else if (value > 100) {
                    setDisc(100);
                  } else {
                    setDisc(value);
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Persentase Diskon"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Buat Diskon
            </button>
          </form>
          <ToastContainer />
          {loading && <Loading />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalCreatedDisc;
