"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Menu } from "lucide-react";
import QuoteModal from "./quote_modal"; // Import Modal

interface CarData {
  id: number;
  name: string;
  slug: string;
  starting_price: number;
  thumbnailUrl: string;
  car_type: string;
  is_featured: boolean;
}

export const generateSlugId = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

const CarList: React.FC = () => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false); // Thêm state cho Modal

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/cars?populate=*`);
        const data = await res.json();

        const fetchedCars: CarData[] = data.data.map((item: any) => {
          const attrs = item;
          let thumbUrl = "";

          if (attrs.thumbnail) {
            const url = attrs.thumbnail.url;
            if (url) {
              thumbUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
            }
          }

          const carTypeData = attrs.car_type;
          const carTypeName = carTypeData?.name || "Chưa phân loại";

          return {
            id: item.id,
            name: attrs.name || "",
            slug: attrs.slug || "",
            starting_price: attrs.starting_price || 0,
            thumbnailUrl: thumbUrl,
            car_type: carTypeName,
            is_featured: attrs.is_featured || false,
          };
        });

        fetchedCars.sort((a, b) =>
          a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1,
        );

        setCars(fetchedCars);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu xe:", error);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, [isLoading]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  const groupedCars = cars.reduce(
    (acc, car) => {
      if (!acc[car.car_type]) acc[car.car_type] = [];
      acc[car.car_type].push(car);
      return acc;
    },
    {} as Record<string, CarData[]>,
  );

  return (
    // Thêm id="danh-sach-xe" để scroll từ Navbutton
    <div
      id="danh-sach-xe"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {isLoading ? (
        <div className="animate-pulse flex items-center justify-center py-20 text-gray-500">
          Đang tải danh sách xe...
        </div>
      ) : (
        Object.entries(groupedCars).map(([carType, carsInType]) => (
          <div
            key={carType}
            id={generateSlugId(carType)}
            className="mb-16 last:mb-0 scroll-mt-24"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 uppercase">
              {carType}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {carsInType.map((car) => (
                <div
                  key={car.id}
                  className="flex flex-col h-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <Link
                    href={`/car/${car.slug}`}
                    className="flex flex-col grow cursor-pointer group"
                  >
                    <div className="w-full h-48 md:h-56 mb-4 flex items-center justify-center overflow-hidden">
                      {car.thumbnailUrl ? (
                        <img
                          src={car.thumbnailUrl}
                          alt={car.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#3b66ff] transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-[#2152ff] font-semibold text-base mb-4">
                      GIÁ TỪ: {formatPrice(car.starting_price)} VNĐ
                    </p>
                  </Link>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setIsQuoteOpen(true)} // Mở modal
                      className="flex-1 bg-[#3b66ff] hover:bg-blue-700 text-white py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Calculator className="w-4 h-4" /> BÁO GIÁ
                    </button>
                    <button
                      onClick={() => setIsQuoteOpen(true)} // Mở modal
                      className="flex-1 bg-white border border-[#3b66ff] text-[#3b66ff] hover:bg-blue-50 py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Menu className="w-4 h-4" /> LÁI THỬ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Render Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
};

export default CarList;
