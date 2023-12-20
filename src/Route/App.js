import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";

import DetailNotFound from "../Test/View/User/404/NFScreen";

import SplashScreen from "../Test/View/User/SplashScreen/splash";
import Main from "../Test/View/User/Main";
import IndexPesanan from "../Test/View/User/Pesanan/IndexPesanan";
import OrderForm from "../Test/View/User/Home/Component/OrderForm";
import History from "../Test/View/User/Home/Component/History";
import Register from "../Test/View/User/Auth/Register";
import Login from "../Test/View/User/Auth/Login";

function App() {
  const [loading, setLoading] = useState(true);
  // j3ZftkDMYaULzP4W

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pesanan" element={<IndexPesanan />} />
          <Route path="/order/:id/:name" element={<OrderForm />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<DetailNotFound />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
