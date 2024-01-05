import axiosInstance from "./Config";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyByA2NbnXpFg4yM_h8pug8WgD9hnLyQv4g",
  authDomain: "ac-service-34683.firebaseapp.com",
  databaseURL: "https://ac-service-34683-default-rtdb.firebaseio.com",
  projectId: "ac-service-34683",
  storageBucket: "ac-service-34683.appspot.com",
  messagingSenderId: "372535984207",
  appId: "1:372535984207:web:0dcbc759cee5f2a85aea3a",
  measurementId: "G-1XH4ZTDPQG",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp);

export const getNotificationsRealtime = (username, setNotifications) => {
  const notificationsRef = ref(database, "notifications");

  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    const notifications = [];
    snapshot.forEach((childSnapshot) => {
      const orderDetails = childSnapshot.val();
      // Assuming orderId is the key in your notifications
      const orderId = childSnapshot.key;
      notifications.push({
        orderId,
        message: orderDetails.message || "", // Update with the correct field name
      });
    });
    setNotifications(notifications);
  });

  return unsubscribe;
};

export const submitOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/order", orderData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleRegister = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const handleLogin = async (userData) => {
  try {
    const response = await axiosInstance.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const checkJwt = async () => {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      return { success: false, error: "Token or username not found" };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosInstance.get(
      `/checkJwt?username=${encodeURIComponent(username)}`,
      config
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (accessToken, username) => {
  try {
    const response = await axiosInstance.post(
      "/logout",
      {
        username: username,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async () => {
  try {
    const response = await axiosInstance.get("/product");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHistory = async (page) => {
  const username = localStorage.getItem("username");
  try {
    const response = await axiosInstance.get(
      `/history/${username}?page=${page}`
    );

    return response.data;
  } catch (error) {}
};

export const postComment = async (username, review, rating) => {
  try {
    const response = await axiosInstance.post(`/comment`, {
      username,
      review,
      rating,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllComments = async () => {
  try {
    const response = await axiosInstance.get("/comment");
    return response.data.comments;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (nm_category) => {
  try {
    const response = await axiosInstance.post(
      "/create-category",
      {
        nm_category: nm_category,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.data;

    return data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append("nm_product", productData.nm_product);
    formData.append("desc", productData.desc);
    formData.append("price", productData.price);
    formData.append("categoryId", productData.categoryId);
    formData.append("thumbnail", productData.thumbnail);

    const response = await axiosInstance.post("/create-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to create product");
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`/category`);

    if (!response || !response.data || !response.data.categories) {
      throw new Error("Invalid response format");
    }

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const editProduct = async (id, editedProductData) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("nm_product", editedProductData.nm_product);
    formData.append("desc", editedProductData.desc);
    formData.append("price", editedProductData.price);
    formData.append("categoryId", editedProductData.categoryId);

    if (editedProductData.thumbnail) {
      formData.append("thumbnail", editedProductData.thumbnail);
    }

    const response = await axiosInstance.put(`/edit-product`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const editCategory = async (categoryId, editedCategory) => {
  try {
    const response = await axiosInstance.put(
      `/category/${categoryId}`,
      editedCategory
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/category/${categoryId}`);

    const responseData = response.data;

    return responseData;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to delete category");
  }
};

export const getAllOrders = async (page) => {
  try {
    const response = await axiosInstance.get(`/get-orders?page=${page}`);
    return response;
  } catch (error) {}
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axiosInstance.put(`/update-status`, { orderId, newStatus });

    return { success: true, message: "Status Berhasil diupdate" };
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async (username) => {
  try {
    const response = await axiosInstance.get(`/notifications/${username}`);

    return response.data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
export const generateOTP = async (email) => {
  try {
    const response = await axiosInstance.post("/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (otp) => {
  try {
    const response = await axiosInstance.post("/verify", { otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async ({ email, newPassword }) => {
  try {
    const response = await axiosInstance.post(`/change-password`, {
      email,
      newPassword,
    });

    if (response.status === 200) {
    } else {
      throw new Error("Failed to change password");
    }
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    const response = await axiosInstance.post("/upload/dokumentasi", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export const deleteImage = async (orderId) => {
  try {
    const response = await axiosInstance.delete(`/delete/dokument/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
