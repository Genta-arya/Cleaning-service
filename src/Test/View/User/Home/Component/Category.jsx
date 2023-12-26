import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategories,
  selectSelectedCategory,
  setSelectedCategory,
} from "../../../../../Feature/Redux/Product/ProductSlice";

const Category = () => {
  const categories = useSelector(selectCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const dispatch = useDispatch();

  const handleCategoryChange = (categoryId) => {
    dispatch(setSelectedCategory(categoryId));
  };

  return (
    <div className="mb-4">
      <select
        id="category"
        className="mt-1 p-1 border border-gray-300 lg:w-full  focus:outline-none focus:border-blue-500 text-xs lg:text-lg font-serif rounded-xl "
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        <option value=""className="text-xs lg:text-lg">Semua Kategori</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Category;
