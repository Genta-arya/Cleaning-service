import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import DetailNotFound from "../Test/View/User/404/NFScreen";
import SplashScreen from "../Test/View/User/SplashScreen/splash";
import Main from "../Test/View/User/Main";
import OrderForm from "../Test/View/User/Home/Component/OrderForm";
import History from "../Test/View/User/Home/Component/History";
import Register from "../Test/View/User/Auth/Register";
import Login from "../Test/View/User/Auth/Login";
import IndexMain from "../Test/View/Admin/IndexMain";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <HelmetProvider>
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
                      <title>Tangkas Jaya Teknik</title>
                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <link rel="canonical" href="https://www.tangkasjayateknik.site/"></link>

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <link rel="canonical" href="https://www.tangkasjayateknik.site/admin/dashboard"></link>
                      <meta
                        name="description"
                        content="Your description for the admin dashboard."
                      />
                       <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <link rel="canonical" href="https://www.tangkasjayateknik.site/register"></link>

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <link rel="canonical" href="https://www.tangkasjayateknik.site/login"></link>

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <link rel="canonical" href="https://www.tangkasjayateknik.site/history"></link>

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
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
                      <title>
                        Tangkas Jaya Teknik - Halaman Tidak diTemukan
                      </title>

                      <meta
                        name="description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />

                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />
                      <meta property="og:image:width" content="1200" />
                      <meta property="og:image:height" content="630" />

                      <meta
                        property="og:site_name"
                        content="Jasa Service AC Terpercaya di Bali"
                      />

                      <meta property="og:type" content="website" />
                      <meta
                        property="og:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="og:title"
                        content="Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="og:description"
                        content="Tangkas Jaya Teknik Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="og:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        property="twitter:card"
                        content="summary_large_image"
                      />
                      <meta
                        property="twitter:url"
                        content="https://www.tangkasjayateknik.site"
                      />
                      <meta
                        property="twitter:title"
                        content="Tangkas Jaya Teknik | Jasa Service AC Terpercaya di Bali"
                      />
                      <meta
                        property="twitter:description"
                        content="Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!"
                      />
                      <meta
                        property="twitter:image"
                        content="https://www.tangkasjayateknik.site/seo.png"
                      />

                      <meta
                        name="keywords"
                        content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik, service ac indonesia, ac indonesia, service ac"
                      />
                    </Helmet>
                    <DetailNotFound />
                  </>
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
