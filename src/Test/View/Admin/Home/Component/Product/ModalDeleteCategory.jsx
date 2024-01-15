import React, { useState, useEffect } from "react";
import {
  DeleteCategory,
  getAllCategories,
} from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Customer/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
const ModalDeleteCategory = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const validateForm = () => {
    if (!selectedCategoryId) {
      setValidationError("Please select a category");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleDeleteCategory = async () => {
    try {
      setLoading(true);

      if (!validateForm()) {
        return;
      }

      const categoryId = parseInt(selectedCategoryId, 10);
      fetchCategories();
      await DeleteCategory(categoryId);
      toast.success("Berhasi Hapus Kategori");
    } catch (error) {
      if (error.response) {
        toast.error("Gagal Menghapus Kategori");
      } else {
        toast.error("Terjadi Kesalahan server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-8 rounded-md shadow-md w-96 relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <select
          value={selectedCategoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>
            Pilih Kategori
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nm_category}
            </option>
          ))}
        </select>

        {validationError && (
          <div className="text-red-500 mb-4">{validationError}</div>
        )}

        <button
          onClick={handleDeleteCategory}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none w-full"
        >
          Hapus Kategori
        </button>
      </motion.div>
      {loading && <Loading />}
      <ToastContainer />
    </motion.div>
  );
};

export default ModalDeleteCategory;
