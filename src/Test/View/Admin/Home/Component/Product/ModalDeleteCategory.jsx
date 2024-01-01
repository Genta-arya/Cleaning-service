import React, { useState, useEffect } from "react";
import { DeleteCategory, getAllCategories } from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ModalDeleteCategory = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

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

      await DeleteCategory(categoryId);
      window.location.reload();

      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-8 rounded-md shadow-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          {/* Close button with FontAwesome icon */}
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <select
          value={selectedCategoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled>
            Select a category
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
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none"
        >
          {loading ? "Deleting..." : "Delete Category"}
        </button>
      </div>
    </div>
  );
};

export default ModalDeleteCategory;
