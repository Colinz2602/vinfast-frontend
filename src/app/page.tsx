"use client";

import React, { useState, useEffect } from "react";
import Navbutton from "./components/navbutton";
import Slider from "./components/slider";
import CarList from "./components/cars_list";
import Experience from "./components/experience";

export default function Home() {
  const [data, setData] = useState<any>({
    sliders: null,
    cars: null,
    experience: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
        const [sliderRes, carsRes, expRes] = await Promise.all([
          // Vẫn khuyên bạn nên dùng query fields/populate cụ thể ở đây để tối ưu RAM nhất có thể
          fetch(`${API_URL}/api/sliders?populate=*`),
          fetch(`${API_URL}/api/cars?populate=*`),
          fetch(`${API_URL}/api/experience?populate[experience][populate]=*`),
        ]);

        setData({
          sliders: await sliderRes.json(),
          cars: await carsRes.json(),
          experience: await expRes.json(),
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Slider initialData={data.sliders?.data} />
      <Navbutton />
      <CarList initialData={data.cars?.data} />
      <Experience initialData={data.experience?.data} />
    </main>
  );
}
