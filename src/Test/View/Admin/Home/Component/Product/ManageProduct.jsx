import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  DeleteDiscount,
  checkJwt,
  deleteProduct,
  getProduct,
} from "../../../../../../Service/Api";
import SkeletonRow from "./SkeletonRow";

import ModalCreateProduct from "./ModalCreateProduct";
import ModalEditProduct from "./ModalEditProduct";

import MenuCategory from "./MenuCategory";
import { useNavigate } from "react-router-dom";
import {
  setLoggedIn,
  setRole,
} from "../../../../../../Feature/Redux/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import Loading from "../Customer/Loading";
import ReactQuill from "react-quill";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import ModalDiscountProduct from "./Discount/ModalDiscountProduct";
import ModalShowDiscount from "./Discount/ModalShowDiscount";
import { ToastContainer, toast } from "react-toastify";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDeleteDisc, setLoadingDosc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscModalOpen, setIsDiscModalOpen] = useState(false);
  const [isDiscModalEyeOpen, setIsDiscModalEyeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDelete, setSelectedProductDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

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
  useEffect(() => {
    fetchData();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkJwt();

        if (data.success) {
          dispatch(setLoggedIn(true));
          dispatch(setRole(data.role));

          if (data.role !== "admin") {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [dispatch, navigate]);

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

  const handleCreatedDiscount = (product) => {
    setSelectedProduct(product);

    setIsDiscModalOpen(true);
  };

  const handleCreatedDiscountClose = () => {
    setIsDiscModalOpen(false);
  };

  const handleEyeDiscount = (product) => {
    setSelectedProduct(product);

    setIsDiscModalEyeOpen(true);
  };

  const handleEyeDiscountClose = () => {
    setIsDiscModalEyeOpen(false);
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

  const handleDeleteDiscount = async (id) => {
    setLoadingDosc(true);
    try {
      await DeleteDiscount(id);

      const response = await getProduct();
      const { products } = response;
      setProducts(products);

      toast.success("Berhasil menghapus Diskon");
    } catch (error) {
      setLoadingDosc(false);
      if (error.response) {
        toast.error(error.response.data.message);
        setLoadingDosc(false);
      } else {
        toast.error("terjadi kesalahan pada server");
      }
    } finally {
      // setLoadingDosc(false);
    }
  };

  const handleEditSave = (editedProductData) => {};

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
        <table className="mt-8 w-full border-collapse text-center ">
          <thead className="">
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 p-2">No</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Service</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Harga</th>
              <th className="border border-gray-300 p-2">Kategori</th>
              <th className="border border-gray-300 p-2">Produk</th>
              <th className="border border-gray-300 p-2">Diskon</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={product.url}
                    alt="image"
                    className="rounded-xl w-32 h-auto"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {product.nm_product}
                </td>
                <td className="border border-gray-300 p-2">
                  {" "}
                  <ReactQuill
                    value={product.desc}
                    readOnly={true}
                    className="leading-relaxed"
                    theme={"bubble"}
                  />
                </td>
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

                <td className="border border-gray-300 p-2">
                  <div className="flex">
                    <div className="dropdown dropdown-hover dropdown-end">
                      <button
                        className="text-blue-500 hover:underline mr-2"
                        tabIndex={0}
                        role="button"
                        onClick={() => handleCreatedDiscount(product)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>

                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 text-xs items-center "
                      >
                        <li>
                          <a>Tambah Discount</a>
                        </li>
                      </ul>
                    </div>

                    <div className="dropdown dropdown-hover">
                      <button
                        className="text-biru hover:underline mr-2"
                        tabIndex={0}
                        role="button"
                        onClick={() => handleEyeDiscount(product)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 text-xs items-center"
                      >
                        <li>
                          <a>Lihat Discount</a>
                        </li>
                      </ul>
                    </div>

                    <div className="dropdown dropdown-hover ">
                      <button
                        tabIndex={0}
                        role="button"
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteDiscount(product.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 text-xs items-center "
                      >
                        <li>
                          <a>Hapus Discount</a>
                        </li>
                      </ul>
                    </div>
                  </div>
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
      {isDiscModalEyeOpen && (
        <ModalShowDiscount
          productId={selectedProduct}
          onClose={handleEyeDiscountClose}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <ModalEditProduct
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          productData={selectedProduct}
          refresh={fetchData}
          onEdit={handleEditSave}
        />
      )}

      {isDiscModalOpen && (
        <ModalDiscountProduct
          onClose={handleCreatedDiscountClose}
          productId={selectedProduct}
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
                  <Loading />
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
      {loading && <Loading />}
      {loadingDeleteDisc && <Loading />}
      <ToastContainer />
    </div>
  );
};

export default ManageProduct;
