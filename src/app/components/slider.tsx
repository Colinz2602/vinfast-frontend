"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Định nghĩa kiểu dữ liệu dựa trên cấu trúc trả về từ Strapi của bạn
interface SlideData {
  id: number;
  imageUrl: string;
}

const Slider: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hàm fetch dữ liệu từ Strapi
    const fetchSlides = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/sliders?populate=*`);
        const data = await res.json();

        // Tạo một mảng rỗng để chứa toàn bộ hình ảnh
        const allSlides: SlideData[] = [];

        // Duyệt qua từng bản ghi slider từ API
        data.data.forEach((item: any) => {
          // Kiểm tra xem trường image có dữ liệu và là một mảng hay không
          if (item.image && Array.isArray(item.image)) {
            // Lặp qua tất cả các ảnh có trong trường image này
            item.image.forEach((img: any) => {
              const imgUrl = img.url;
              allSlides.push({
                id: img.id, // Dùng ID của chính bức ảnh để đảm bảo key không bị trùng lặp
                imageUrl: imgUrl.startsWith("http")
                  ? imgUrl
                  : `${API_URL}${imgUrl}`,
              });
            });
          }
        });

        setSlides(allSlides);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu slider:", error);
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (isLoading) {
    return (
      <div className="w-full h-125 md:h-150 bg-gray-200 animate-pulse"></div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-75 smsm:h-100 md:h-150 lg:h-175 group overflow-hidden">
      <div
        className="w-full h-full flex flex-nowrap transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-none relative">
            <img
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover object-center block"
            />
          </div>
        ))}
      </div>

      {/* Nút Arrow Trái */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer z-10"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Nút Arrow Phải */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer z-10"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dấu chấm Pagination */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all duration-300 rounded-full cursor-pointer shadow-sm 
              ${currentIndex === slideIndex ? "w-3 h-3 bg-white" : "w-3 h-3 bg-white/50 hover:bg-white/80"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
