import React, { useEffect, useState } from "react";
import { editProduct, getAllCategories } from "../../../../../../Service/Api";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

const ModalEditProduct = ({ isOpen, onClose, productData, onEdit }) => {
  const MAX_PRODUCT_NAME_LENGTH = 150;
  const MAX_DESCRIPTION_LENGTH = 350;
  console.log(productData.id)

  const [categories, setCategories] = useState([]);
  const [editedProductData, setEditedProductData] = useState({
    nm_product: productData.nm_product,
    desc: productData.desc,
    price: productData.price,
    categoryId: productData.category.id.toString(),
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    productData.thumbnail ? productData.url : null
  );
  const [updatedThumbnailFileName, setUpdatedThumbnailFileName] =
    useState(null);
  const handleSave = async () => {
    setLoading(true);

    try {
      if (
        editedProductData &&
        editedProductData.nm_product &&
        editedProductData.desc &&
        editedProductData.price &&
        editedProductData.categoryId
      ) {
        const updatedData = {
          ...editedProductData,
          thumbnail: editedProductData.thumbnail || productData.thumbnail,
        };

        if (editedProductData.thumbnail) {
          const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
          if (!acceptedFileTypes.includes(editedProductData.thumbnail.type)) {
            throw new Error(
              "Invalid file type. Please select a PNG or JPEG/JPG file."
            );
          }
        }

        const response = await editProduct(productData.id, updatedData);

        if (
          response.status === 200 &&
          response.product &&
          response.product.thumbnail
        ) {
          const originalFileName = response.product.thumbnail;
          setUpdatedThumbnailFileName(originalFileName);
          setLoading(false);
        }

        onEdit(updatedData);
        onClose();

        if (response.status === 200) {
          setLoading(false);
          toast.success("Product updated successfully!");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error("Periksa Kembali Data yang diisi ya");
      console.log(error);
    }
  };

  useEffect(() => {
    if (editedProductData.thumbnail) {
      setThumbnailPreview(URL.createObjectURL(editedProductData.thumbnail));
    } else {
      setThumbnailPreview(productData.thumbnail ? productData.url : null);
    }
  }, [editedProductData.thumbnail, productData.thumbnail, productData.url]);

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

  const formatIDR = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue.replace(/\D/g, ""), 10);
    const formattedValue = numericValue.toLocaleString("id-ID");

    setEditedProductData({
      ...editedProductData,
      price: isNaN(numericValue) ? "" : numericValue,
    });
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!acceptedFileTypes.includes(selectedFile.type)) {
        toast.error("Format harus png/jpeg/jpg ya");
        return;
      }

      setEditedProductData({
        ...editedProductData,
        thumbnail: selectedFile,
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white w-[80%] p-6 rounded shadow-lg overflow-y-auto max-h-[550px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Product Name:</span>
            <input
              type="text"
              value={editedProductData.nm_product}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= MAX_PRODUCT_NAME_LENGTH) {
                  setEditedProductData({
                    ...editedProductData,
                    nm_product: inputValue,
                  });
                }
              }}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {editedProductData.nm_product.length > MAX_PRODUCT_NAME_LENGTH && (
              <p className="text-red-500 mt-1">
                Maximum length: {MAX_PRODUCT_NAME_LENGTH} characters
              </p>
            )}
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Description:</span>
            <textarea
              value={editedProductData.desc}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue.length <= MAX_DESCRIPTION_LENGTH) {
                  setEditedProductData({
                    ...editedProductData,
                    desc: inputValue,
                  });
                }
              }}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {editedProductData.desc.length > MAX_DESCRIPTION_LENGTH && (
              <p className="text-red-500 mt-1">
                Maximum length: {MAX_DESCRIPTION_LENGTH} characters
              </p>
            )}
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Price:</span>
            <input
              type="text"
              value={editedProductData.price.toLocaleString("id-ID")}
              onChange={handlePriceChange}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="block mb-2">
            <span className="text-gray-700">Category:</span>
            <select
              value={editedProductData.categoryId}
              onChange={(e) =>
                setEditedProductData({
                  ...editedProductData,
                  categoryId: e.target.value,
                })
              }
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.nm_category}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">Thumbnail:</span>
            <input
              type="file"
              onChange={handleThumbnailChange}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>

          <div className="mb-2">
            <div className="mt-1 p-2 border rounded justify-center flex">
              {thumbnailPreview ? (
                <div>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="rounded-md max-w-full"
                  />
                  {updatedThumbnailFileName && (
                    <p className="text-sm text-gray-500">
                      Updated File: {updatedThumbnailFileName}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">
                  <FontAwesomeIcon icon={faImage} className="mr-2" />
                  No thumbnail
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className={`relative bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <PulseLoader size={8} color="#fff" /> : "Save Changes"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ModalEditProduct;
