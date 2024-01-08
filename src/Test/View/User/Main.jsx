import React from "react";
import { Helmet } from "react-helmet";
import IndexHome from "./Home/IndexHome";

const Main = () => {
  const siteTitle = "Tangkas Jaya Teknik";
  const pageDescription =
    "Tangkas Jaya Teknik, Profesional Layanan AC di Bali. Solusi Cepat & Handal, Kepuasan Pelanggan Prioritas Kami. Hubungi Sekarang!";
  const imageUrl =
    "https://www.tangkasjayateknik.site/static/media/wayan%20logo.cb0052e55f7b1f9d551e.png";
  const pageUrl = "https://www.tangkasjayateknik.site/";

  return (
    <div className=" bg-biru">
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik"
        />
      </Helmet>
      <IndexHome />
    </div>
  );
};

export default Main;
