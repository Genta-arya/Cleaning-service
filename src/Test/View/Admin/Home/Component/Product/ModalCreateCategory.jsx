import React, { useState } from "react";
import { createCategory } from "../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Customer/Loading";

const ModalCreateCategory = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async () => {
    try {
      if (!categoryName.trim()) {
        toast.error("Nama kategori harus diisi");
        return;
      }

      setLoading(true);

      await createCategory(categoryName);

      toast.success("Kategori berhasil dibuat");
      setCategoryName("");
    } catch (error) {
      if (error.message === "Failed to create category") {
        toast.error("Gagal membuat kategori");
      } else {
        console.error("Error creating category:", error);
        toast.error("Terjadi kesalahan saat membuat kategori");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {onClose && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-96 p-6 rounded shadow-lg"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tambah Kategori</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <div>
              <label className="block mb-2">
                <span className="text-gray-700">Nama Kategori:</span>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-center">
              <motion.button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue relative"
                onClick={handleCreateCategory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tambah Kategori
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {loading && <Loading />}
      <ToastContainer />
    </>
  );
};

export default ModalCreateCategory;
