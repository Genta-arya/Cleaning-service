import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";

import DetailNotFound from "../Test/View/User/404/NFScreen";
import SplashScreen from "../Test/View/User/SplashScreen/splash";
import Main from "../Test/View/User/Main";
import IndexPesanan from "../Test/View/User/Pesanan/IndexPesanan";
import OrderForm from "../Test/View/User/Home/Component/OrderForm";
import History from "../Test/View/User/Home/Component/History";
import Register from "../Test/View/User/Auth/Register";
import Login from "../Test/View/User/Auth/Login";
import IndexMain from "../Test/View/Admin/IndexMain";
import NotifTest from "../Test/View/User/Home/Component/NotifTest";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Router>
      <Routes>
        {loading ? (
          <Route path="/" element={<SplashScreen />} />
        ) : (
          <>
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik </title>
                  </Helmet>
                  <Main />
                </>
              }
            />

            

            <Route
              path="/admin/dashboard"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Admin</title>
                  </Helmet>
                  <IndexMain />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Register</title>
                  </Helmet>
                  <Register />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Login</title>
                  </Helmet>
                  <Login />
                </>
              }
            />

            <Route
              path="/order/:id/:name"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Form Pemesanan</title>
                  </Helmet>
                  <OrderForm />
                </>
              }
            />
            <Route
              path="/history"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Pesanan</title>
                  </Helmet>
                  <History />
                </>
              }
            />
            <Route
              path="*"
              element={
                <>
                  <Helmet>
                    <title>Tangkas Jaya Teknik - Halaman Tidak diTemukan</title>
                  </Helmet>
                  <DetailNotFound />
                </>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
