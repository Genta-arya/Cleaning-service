import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";

import DetailNotFound from "../Test/View/User/404/NFScreen";

import SplashScreen from "../Test/View/User/SplashScreen/splash";
import Main from "../Test/View/User/Main";
import IndexPesanan from "../Test/View/User/Pesanan/IndexPesanan";
import OrderForm from "../Test/View/User/Home/Component/OrderForm";
import History from "../Test/View/User/Home/Component/History";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Router>
      {loading ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<Main />} />
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
