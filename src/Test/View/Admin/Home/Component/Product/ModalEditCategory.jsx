import React, { useState, useEffect } from "react";
import { editCategory, getAllCategories } from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Customer/Loading";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
const ModalEditCategory = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editedCategory, setEditedCategory] = useState({});
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
    if (!selectedCategoryId || !editedCategory.nm_category) {
      setValidationError("Form tidak boleh ada yang kosong ya");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      if (!validateForm()) {
        return;
      }

      const categoryId = parseInt(selectedCategoryId, 10);
      await editCategory(categoryId, editedCategory);
      toast.success("Kategori Berhasil diEdit");

      fetchCategories();
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error("Kategori Gagal diubah");
      } else {
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

        <form>
          <label className="block mb-4">
            <span className="text-gray-700">Nama Kategori:</span>
            <input
              type="text"
              value={editedCategory.nm_category || ""}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  nm_category: e.target.value,
                })
              }
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>
        </form>

        {validationError && (
          <div className="text-red-500 mb-4">{validationError}</div>
        )}

        <button
          onClick={handleSaveChanges}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg  w-full focus:outline-none"
        >
          Simpan Perubahan
        </button>
      </motion.div>
      <ToastContainer />
      {loading && <Loading />}
    </motion.div>
  );
};

export default ModalEditCategory;
