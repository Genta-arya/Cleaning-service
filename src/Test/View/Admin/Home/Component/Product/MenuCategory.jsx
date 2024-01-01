import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ModalCreateCategory from "./ModalCreateCategory";
import ModalEditCategory from "./ModalEditCategory";
import ModalDeleteCategory from "./ModalDeleteCategory";

const MenuCategory = ({ onClose }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className=" gap-4 bg-white p-8 rounded-xl w-auto">
        <div className="flex justify-between mb-12 ">
          <h1 className="text-base font-bold">Menu</h1>
          <FontAwesomeIcon
            icon={faTimes}
            color="black"
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Kategori
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit Kategori
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Hapus Kategori
          </button>
        </div>
      </div>

      {isAddModalOpen && (
        <ModalCreateCategory onClose={() => setIsAddModalOpen(false)} />
      )}

      {isEditModalOpen && (
        <ModalEditCategory onClose={() => setIsEditModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <ModalDeleteCategory onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
};

export default MenuCategory;
