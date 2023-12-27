import React from "react";
import { Helmet } from "react-helmet";
import IndexHome from "./Home/IndexHome";

const Main = () => {
  const pageTitle = "Tangkas Teknik Jaya - HomePage";
  const pageDescription =
    "Selamat datang di Tangkas Teknik Jaya ! Kami adalah mitra terpercaya Anda dalam layanan AC di Bali. Dengan tim teknisi berpengalaman, kami siap memberikan solusi cepat dan handal untuk perbaikan, perawatan, dan instalasi AC. Kami memprioritaskan kepuasan pelanggan dengan harga yang kompetitif. Percayakan kebutuhan AC Anda kepada kami dan rasakan kenyamanan yang optimal dalam ruangan Anda. Hubungi kami sekarang untuk pelayanan yang berkualitas";
  const imageUrl =
    "https://cleaning-service-brown.vercel.app/static/media/wayan%20logo.cb0052e55f7b1f9d551e.png";
  const pageUrl = "https://cleaning-service-brown.vercel.app/";

  return (
    <div className="bg-biru">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="Jasa Service AC Tangkas Teknik Jaya
, Service AC Terpercaya Tangkas Teknik Jaya, AC Service Tangkas Teknik Jaya"
        />
        <meta name="author" content="wayan" />
        {/* Open Graph meta tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@YourTwitterHandle" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        {/* Add other meta tags, styles, scripts, etc. here */}
      </Helmet>
      <IndexHome />
    </div>
  );
};

export default Main;
