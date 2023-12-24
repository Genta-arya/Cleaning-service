import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Testimoni = () => {
  const [testimonialImages, setTestimonialImages] = useState([]);

  useEffect(() => {
    const fetchTestimonialImages = async () => {
      try {
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=5');
        const data = await response.json();
        const images = data.map((item) => `https://picsum.photos/id/${item.id}/800/400`);
        setTestimonialImages(images);
      } catch (error) {
        console.error('Error fetching testimonial images:', error);
      }
    };

    fetchTestimonialImages();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: '0', 
    arrows: false,
  };

  return (
    <div className=" bg-biru   p-8">
      <div className='flex justify-center mb-4'>
        <h1 className='text-white font-bold font-serif text-2xl'>Testimoni Kami</h1>
      </div>
      
      <Slider {...settings} className="mx-auto">
        {testimonialImages.map((image, index) => (
          <div key={index} className="slick-slide  px-8  "> 
            <img
              src={image}
              alt={`Testimonial ${index + 1}`}
              className="testimoni-image w-full h-full rounded-3xl  mb-4 py-4  "
            />
            <div className="text-white">
              <p className="text-lg font-semibold mb-2">Client Name</p>
              <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at velit maximus, molestie est a, tempor magna.</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimoni;
