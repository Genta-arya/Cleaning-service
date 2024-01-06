// middleware.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const password = 'tangkasjayateknik_password'; // Ganti dengan kata sandi yang sesuai

// Middleware untuk menambahkan header 'x-access-password' ke setiap permintaan
export const addPasswordToRequest = async (config) => {
  config.headers['x-access-password'] = password;
  return config;
};

// Buat instance Axios yang akan menggunakan middleware
export const axiosWithMiddleware = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menambahkan middleware ke instance Axios
axiosWithMiddleware.interceptors.request.use(addPasswordToRequest);
