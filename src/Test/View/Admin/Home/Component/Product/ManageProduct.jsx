import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { deleteProduct, getProduct } from "../../../../../../Service/Api";
import SkeletonRow from "./SkeletonRow";

import ModalCreateProduct from "./ModalCreateProduct";
import ModalEditProduct from "./ModalEditProduct";
import { PulseLoader } from "react-spinners";
import MenuCategory from "./MenuCategory";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDelete, setSelectedProductDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProduct();
        const { products } = response;
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.nm_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.nm_category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product) => {
    setSelectedProduct(product);

    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProductDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProductDelete && selectedProductDelete.id) {
      try {
        setLoadingDelete(true);

        await deleteProduct(selectedProductDelete.id);

        const response = await getProduct();
        const { products } = response;
        setProducts(products);

        console.log(`Deleted product with ID ${selectedProductDelete.id}`);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoadingDelete(false);
        handleCloseDeleteModal();
      }
    } else {
      console.error("Cannot delete. Selected product is null or missing id.");
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenProductModal = () => {
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
  };

  const handleEditSave = (editedProductData) => {
    console.log("Edited Product Data:", editedProductData);
  };
 
  return (
    <div className="px-12 p-8">
      <div className="flex justify-center gap-4">
        <div className="relative flex-grow justify-center mx-auto">
          <input
            type="text"
            placeholder="cari service..."
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500 w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
          </div>
        </div>

        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
          onClick={handleOpenProductModal}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Service
        </button>

        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:shadow-outline-green"
          onClick={handleOpenModal}
        >
          Manage Kategori
        </button>
      </div>

      {loading ? (
        <div className="mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-4 text-center text-red-500">
          Product tidak ditemukan.
        </p>
      ) : (
        <table className="mt-8 w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Service</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Harga</th>
              <th className="border border-gray-300 p-2">Kategori</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <img src={product.url} alt="image" className="rounded-xl" />
                </td>
                <td className="border border-gray-300 p-2">
                  {product.nm_product}
                </td>
                <td className="border border-gray-300 p-2">{product.desc}</td>
                <td className="border border-gray-300 p-2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price)}
                </td>
                <td className="border border-gray-300 p-2">
                  {product.category.nm_category}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-blue-500 hover:underline mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleOpenDeleteModal(product)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && <MenuCategory onClose={handleCloseModal} />}
      {isProductModalOpen && (
        <ModalCreateProduct onClose={handleCloseProductModal} />
      )}
      {isEditModalOpen && selectedProduct && (
        <ModalEditProduct
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          productData={selectedProduct}
          onEdit={handleEditSave}
        />
      )}
      {isDeleteModalOpen && selectedProductDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white w-[400px] p-6 rounded shadow-lg">
            <p className="text-lg font-semibold mb-4">Delete Product</p>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end">
              {loadingDelete ? (
                <div className="flex items-center justify-center">
                  <PulseLoader color="#3498db" size={8} margin={2} />
                </div>
              ) : (
                <>
                  <button
                    className="text-gray-500 hover:text-gray-700 mr-4"
                    onClick={handleCloseDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={handleDeleteConfirm}
                    disabled={loadingDelete}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
