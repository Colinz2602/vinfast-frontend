"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface ExperienceData {
  content_text: string;
  content_images: string[];
}

const Experience: React.FC = () => {
  const [showroom, setShowroom] = useState<string>("");
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin Showroom từ Global Settings
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

        const resSettings = await fetch(`${API_URL}/api/global-setting`);
        const dataSettings = await resSettings.json();
        const attrsSettings = dataSettings?.data || {};
        if (attrsSettings.showroom) {
          setShowroom(attrsSettings.showroom);
        }

        // Lấy nội dung Trải nghiệm từ API experience
        const resExp = await fetch(
          `${API_URL}/api/experience?populate[experience][populate]=*`,
        );
        const dataExp = await resExp.json();
        const attrsExp = dataExp?.data?.attributes || dataExp?.data || {};

        const expArray = attrsExp.experience || [];
        if (expArray.length > 0) {
          const firstExp = expArray[0];
          const images: string[] = [];

          if (
            firstExp.content_images &&
            Array.isArray(firstExp.content_images)
          ) {
            firstExp.content_images.forEach((img: any) => {
              const url = img?.url;
              if (url) {
                images.push(url.startsWith("http") ? url : `${API_URL}${url}`);
              }
            });
          }

          setExperienceData({
            content_text: firstExp.content_text || "",
            content_images: images,
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Experience:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Trong lúc đợi API hoặc nếu dữ liệu trống, hiển thị màn hình chờ (Skeleton)
  if (isLoading || !experienceData) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full h-32 bg-gray-200 animate-pulse mb-12 rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="w-full h-87.5 md:h-105 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start justify-between">
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-[28px] lg:text-[32px] font-bold text-gray-900 uppercase mb-2">
            Trải nghiệm xe VinFast
          </h2>
          <h3 className="text-[22px] lg:text-[24px] font-semibold text-[#3b66ff] uppercase md:text-left md:mr-10">
            {showroom}
          </h3>
        </div>
        <div className="w-full md:w-1/2">
          <p className="text-gray-600 text-[15px] leading-[1.8] text-justify whitespace-pre-wrap">
            {experienceData.content_text}
          </p>
        </div>
      </div>

      {/* Image Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {experienceData.content_images.map((imgUrl, index) => {
          const isEven = index % 2 === 0;
          const cardTitle = isEven
            ? "Bảng giá xe và khuyến mãi"
            : "Lái thử xe và trải nghiệm";
          const cardDesc = isEven
            ? "Cập nhận bảng giá xe VinFast và khuyến mãi mới nhất."
            : "Lái thử xe VinFast và trải nghiệm.";
          const btnText = isEven ? "Bảng giá xe" : "Lái thử xe";

          return (
            <div
              key={index}
              className="relative group overflow-hidden bg-gray-200 cursor-pointer rounded-sm shadow-md"
            >
              <img
                src={imgUrl}
                alt={cardTitle}
                className="w-full h-87.5 md:h-105 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-10 pointer-events-none">
                <h4 className="text-white text-[18px] md:text-[20px] font-bold mb-1">
                  {cardTitle}
                </h4>
                <h3 className="text-white text-[32px] md:text-[36px] font-bold uppercase tracking-wide mb-2">
                  VINFAST
                </h3>
                <p className="text-gray-300 text-[15px] mb-6">{cardDesc}</p>
                <div className="pointer-events-auto">
                  <button className="bg-[#3b66ff] hover:bg-blue-700 text-white py-2.5 px-6 font-medium transition-colors flex items-center gap-2 cursor-pointer">
                    {btnText} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Experience;
