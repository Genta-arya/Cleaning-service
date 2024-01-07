import React, { useState, useEffect } from "react";
import { createProduct, getAllCategories } from "../../../../../../Service/Api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCreateProduct = ({ onClose }) => {
  const [productData, setProductData] = useState({
    nm_product: "",
    desc: "",
    price: 0,
    categoryId: 0,
    thumbnail: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();

        if (!response || !response.categories) {
          throw new Error("Invalid response format");
        }

        setCategories(response.categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateProduct = async () => {
    try {
      setIsCreating(true);

      if (
        !productData.nm_product.trim() ||
        !productData.desc.trim() ||
        productData.price <= 0 ||
        productData.categoryId <= 0
      ) {
        toast.error("Periksa semua form lagi ya");
        return;
      }

    

      const response = await createProduct(productData);

      if (response.status === 201) {
        toast.success("Product berhasil dibuat");
        setIsCreating(false);

        setProductData({
          nm_product: "",
          desc: "",
          price: 0,
          categoryId: 0,
          thumbnail: null,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Terjadi kesalahan saat membuat product");
    } finally {
      setIsCreating(false);
    }
  };
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseInt(rawValue.replace(/\D/g, ""), 10);
    const formattedValue = numericValue.toLocaleString("id-ID");
    setProductData({ ...productData, price: numericValue });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProductData({ ...productData, thumbnail: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white w-96 p-6 rounded shadow-lg overflow-y-auto max-h-[550px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tambah Service</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Nama Service:</span>
            <input
              type="text"
              value={productData.nm_product}
              onChange={(e) =>
                setProductData({ ...productData, nm_product: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Deskripsi:</span>
            <textarea
              value={productData.desc}
              onChange={(e) =>
                setProductData({ ...productData, desc: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Harga:</span>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">Rp</span>
              <input
                type="text"
                pattern="[0-9]*"
                value={productData.price.toLocaleString("id-ID")}
                onChange={handlePriceChange}
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </label>
        </div>

        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Kategori:</span>
            <select
              value={productData.categoryId}
              onChange={(e) =>
                setProductData({ ...productData, categoryId: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            >
              <option value={0} disabled>
                Pilih Kategori
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nm_category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block mb-2">
            <span className="text-gray-700">Thumbnail (PNG or JPEG):</span>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </label>
        </div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Thumbnail Preview"
            className="mt-2 w-full border rounded"
          />
        )}
        <div className="mt-4 flex justify-center">
          {isCreating ? (
            <div className="relative">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded opacity-50 cursor-not-allowed"
                disabled
              >
                Creating...
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-t-4 border-blue-800 border-solid rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue w-full"
              onClick={handleCreateProduct}
            >
              Submit
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ModalCreateProduct;
