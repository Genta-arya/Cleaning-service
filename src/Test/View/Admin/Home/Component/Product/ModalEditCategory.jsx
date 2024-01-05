import React, { useState, useEffect } from "react";
import { editCategory, getAllCategories } from "../../../../../../Service/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ModalEditCategory = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editedCategory, setEditedCategory] = useState({});
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
      window.location.reload();


    } catch (error) {

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

        <form>
          <label className="block mb-4">
            <span className="text-gray-700">Category Name:</span>
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
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ModalEditCategory;
