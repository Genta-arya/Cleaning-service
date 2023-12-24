import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const LandingPage = () => {
  const openWhatsApp = () => {
    const phoneNumber = "6287762689648";
    const message = "Hello, Saya butuh jasa service AC.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex justify-center">
      <div className="py-12 w-[90%] text-white">
        <div>
          <h1 className="font-serif text-center text-xl max-w-screen-md mx-auto leading-relaxed">
            Apakah Anda mengalami masalah pada AC Anda, seperti AC panas, AC
            mati, AC tidak dingin, AC berisik? Apakah Anda membutuhkan service
            AC yang murah dan bergaransi?
          </h1>
        </div>

        <div className="flex justify-center items-center py-8">
          <button
            className="bg-white p-2 rounded-xl text-white flex items-center gap-4"
            onClick={openWhatsApp}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-2xl cursor-pointer text-green-500 hover:text-green-600 px-1"
            />
            <span className="mr-2 text-biru font-bold">Kontak Kami</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
