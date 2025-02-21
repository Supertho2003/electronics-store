import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const images = [
  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/desk_header_19_5a0e1c17ea.png",
  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/desk_header_700b836e9e.png",
  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/desk_header_0f69e3f2f9.png",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="relative mt-[100px] md:mt-[120px] mx-4 md:mx-[67px] 2xl:mx-[360px] overflow-hidden rounded-xl shadow-lg">
      <div className="relative w-full h-56 md:h-72 xl:h-[350px]">
        <AnimatePresence>
          <motion.img
            key={index}
            src={images[index]}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full md:object-fill object-cover rounded-xl"
          />
        </AnimatePresence>
      </div>

      {/* Thanh màu đen trong suốt ở dưới cùng */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/7 bg-black bg-opacity-50 px-2 py-1 flex justify-center space-x-2 rounded-full">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-2 transition-all duration-300 rounded-full ${
              index === idx ? "bg-white w-4" : "bg-gray-400 w-2"
            }`}
          />
        ))}
      </div>

      {/* Ẩn nút prev khi ở slide đầu tiên */}
      {index > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition duration-200"
        >
          <i className="bx bx-chevron-left text-black text-2xl"></i>
        </button>
      )}

      {/* Ẩn nút next khi ở slide cuối cùng */}
      {index < images.length - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition duration-200"
        >
          <i className="bx bx-chevron-right text-black text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default Hero;