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
    <div className="bg-biru">
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Jasa Service AC, Service AC Bali, Service AC Terpercaya, Instalasi AC, Perawatan AC, Perbaikan AC, Tangkas Jaya Teknik"
        />
        <meta name="author" content="wayan" />

        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@YourTwitterHandle" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      <IndexHome />
    </div>
  );
};

export default Main;
