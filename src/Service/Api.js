import axiosInstance from "./Config";

export const submitOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/order", orderData);
    console.log("Order submitted successfully:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleRegister = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    console.log("User registered successfully:", response.data);
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

    if (!token) {
      return { success: false, error: "Token not found" };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axiosInstance.get(`/checkJwt`, config);

    return response.data;
  } catch (error) {
    console.error("Error checking JWT:", error);

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
    console.error("Error during logout:", error);
    throw error;
  }
};