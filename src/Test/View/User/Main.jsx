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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="absolute w-full left-0 right-0   -z-0 
      lg:-bottom-[70%] md:hidden lg:block min-[420px]:-bottom-[62%]  max-[360px]:-bottom-[90%]"
      >
        <path
          fill="#5F93C0"
          fill-opacity="1"
          d="M0,256L30,229.3C60,203,120,149,180,160C240,171,300,245,360,245.3C420,245,480,171,540,144C600,117,660,139,720,154.7C780,171,840,181,900,160C960,139,1020,85,1080,85.3C1140,85,1200,139,1260,176C1320,213,1380,235,1410,245.3L1440,256L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
        ></path>
      </svg>
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
