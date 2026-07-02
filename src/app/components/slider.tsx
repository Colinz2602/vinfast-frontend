"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideData {
  id: number;
  imageUrl: string;
}

const Slider: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/sliders?populate=*`);
        const data = await res.json();

        const allSlides: SlideData[] = [];

        data.data.forEach((item: any) => {
          if (item.image && Array.isArray(item.image)) {
            item.image.forEach((img: any) => {
              const imgUrl = img.url;
              allSlides.push({
                id: img.id,
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
    // Sửa lại khung loading cho tương ứng tỷ lệ mới
    return (
      <div className="w-full aspect-[16/9] md:h-150 lg:h-175 bg-gray-200 animate-pulse"></div>
    );
  }

  if (slides.length === 0) return null;

  return (
    // SỬA Ở ĐÂY: Thêm aspect-[16/9] cho mobile, giữ fixed height cho desktop
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-auto md:h-150 lg:h-175 group overflow-hidden bg-gray-50">
      <div
        className="w-full h-full flex flex-nowrap transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-none relative">
            {/* SỬA Ở ĐÂY: object-contain trên mobile để hiển thị đủ ảnh, object-cover trên desktop */}
            <img
              src={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-contain md:object-cover object-center block"
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 md:left-8 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer z-10"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 md:right-8 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-sm transition-all cursor-pointer z-10"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-2 md:bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`transition-all duration-300 rounded-full cursor-pointer shadow-sm 
              ${currentIndex === slideIndex ? "w-2.5 h-2.5 md:w-3 md:h-3 bg-[#2152ff]" : "w-2.5 h-2.5 md:w-3 md:h-3 bg-white/70 hover:bg-white"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
