import React, { useEffect } from "react";
import like from "../../../../../Asset/like.svg";
import tools from "../../../../../Asset/tools.svg";
import puzzle from "../../../../../Asset/puzzle.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { motion, useAnimation } from "framer-motion";

const AboutMe = () => {
  const gridItems = [
    {
      title: "Bergaransi",
      image: tools,
      text: "Kami memberikan garansi service dalam setiap pekerjaan yang kami lakukan dan jangka waktu menyesuaikan dengan jenis pekerjaan.",
    },
    {
      title: "Berkualitas",
      image: like,
      text: "Kami senantiasa memberikan pelatihan keterampilan kepada teknisi dan menggunakan peralatan dengan standar guna menunjang agar dapat menghasilkan pekerjaan yang berkualitas yang akan memuaskan setiap customer kami.",
    },
    {
      title: "Berkompetensi",
      image: puzzle,
      text: "Kami telah banyak menjalin kerja sama dengan swasta dan instansi pemerintahan, sehingga tidak perlu diragukan lagi Skill Kompetensi sumber daya manusia kami yang berhubungan dengan pendingin ruang.",
    },
  ];

  const services = [
    "Pelayanan Cepat",
    "Bergaransi",
    "Terpercaya",
    "Terjamin Mutu dan Kualitas, Profesional",
  ];

  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementPosition = document.getElementById("aboutMeSection").offsetTop;

      if (scrollPosition > elementPosition) {
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <div id="aboutMeSection" className="bg-white py-12">
      <motion.div
        animate={controls}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-8">
          <h1 className="font-serif font-bold text-gelap text-3xl">
            Wayan Service
          </h1>
        </div>
        <div className="flex justify-center mb-8">
          <h1 className="font-serif font-bold text-gelap text-base">
            Berikut alasan Anda harus memilih kami sebagai jasa service AC Anda.
          </h1>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-40 p-8 py-4 mb-4">
            {gridItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex  items-center justify-center py-4 gap-6">
                  <img
                    src={item.image}
                    alt={`Icon ${index + 1}`}
                    className="mx-auto mb-4 w-16 h-16"
                  />
                  <h1 className="font-serif font-bold text-gelap text-lg">
                    {item.title}
                  </h1>
                </div>
                <div className="grid grid-cols-1 text-justify w-56 mx-auto text-biru font-medium">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mb-4 font-serif font-bold text-gelap mt-12">
          Keunggulan lain dari Wayan Service antara lain :
        </div>

        <div className="flex items-center justify-center gap-12 py-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-center mb-2 ">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2"
              />
              <span className="text-sm font-bold text-biru">{service}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
