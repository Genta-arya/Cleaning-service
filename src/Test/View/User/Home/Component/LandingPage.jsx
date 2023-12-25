import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  const openWhatsApp = () => {
    const phoneNumber = "6287762689648";
    const message = "Hello, Saya butuh jasa service AC.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      className="flex justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="py-12 w-[90%] text-white">
        <div>
          <h1 className="font-serif text-center text-xl max-w-screen-md mx-auto leading-relaxed">
            Apakah Anda mengalami masalah pada AC Anda, seperti AC panas, AC
            mati, AC tidak dingin, AC berisik? Apakah Anda membutuhkan service
            AC yang murah dan bergaransi?
          </h1>
        </div>

        <motion.div
          className="flex justify-center items-center py-8"
          variants={buttonVariants}
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
