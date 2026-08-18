"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Menu } from "lucide-react";
import QuoteModal from "./quote_modal";

// Khai báo Prop nhận data từ Server Component
interface CarListProps {
  initialData: any;
}

interface CarData {
  id: number;
  name: string;
  slug: string;
  starting_price: number;
  thumbnailUrl: string;
  car_type: string;
  car_type_order: number;
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

const CarList: React.FC<CarListProps> = ({ initialData }) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

  // Parse dữ liệu từ Server truyền xuống
  const fetchedCars: CarData[] = (initialData || []).map((item: any) => {
    let thumbUrl = "";
    if (item.thumbnail?.url) {
      thumbUrl = item.thumbnail.url.startsWith("http")
        ? item.thumbnail.url
        : `${API_URL}${item.thumbnail.url}`;
    }

    const carTypeData = item.car_type;
    return {
      id: item.id,
      name: item.name || "",
      slug: item.slug || "",
      starting_price: item.starting_price || 0,
      thumbnailUrl: thumbUrl,
      car_type: carTypeData?.name || "Chưa phân loại",
      car_type_order: carTypeData?.order || 999,
      is_featured: item.is_featured || false,
    };
  });

  // Sắp xếp xe
  const orderOToDien = [
    "vf-9",
    "vf-8",
    "vf-7",
    "vf-6",
    "vf-5",
    "vf-4",
    "vf-3",
    "vf-2",
  ];
  const orderKhac = ["limo", "minio", "herio", "ec-van", "nerio"];

  fetchedCars.sort((a, b) => {
    const getSortIndex = (car: CarData) => {
      const currentSlug = car.slug.toLowerCase();
      if (car.car_type === "Xe ô tô điện VinFast") {
        const index = orderOToDien.findIndex((key) =>
          currentSlug.includes(key),
        );
        return index === -1 ? 999 : index;
      } else {
        const index = orderKhac.findIndex((key) => currentSlug.includes(key));
        return index === -1 ? 999 : index;
      }
    };
    const indexA = getSortIndex(a);
    const indexB = getSortIndex(b);
    if (indexA !== indexB) return indexA - indexB;
    return a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1;
  });

  const groupedCars = fetchedCars.reduce(
    (acc, car) => {
      if (!acc[car.car_type]) acc[car.car_type] = [];
      acc[car.car_type].push(car);
      return acc;
    },
    {} as Record<string, CarData[]>,
  );

  const sortedCarTypes = Object.entries(groupedCars).sort((a, b) => {
    const orderA = a[1][0]?.car_type_order ?? 999;
    const orderB = b[1][0]?.car_type_order ?? 999;
    return orderA - orderB;
  });

  // Xử lý scroll khi có hash URL (ví dụ: click từ menu)
  useEffect(() => {
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
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  if (fetchedCars.length === 0) return null;

  return (
    <div
      id="danh-sach-xe"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {sortedCarTypes.map(([carType, carsInType]) => (
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
                    onClick={() => setIsQuoteOpen(true)}
                    className="flex-1 bg-[#3b66ff] hover:bg-blue-700 text-white py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" /> BÁO GIÁ
                  </button>
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="flex-1 bg-white border border-[#3b66ff] text-[#3b66ff] hover:bg-blue-50 py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Menu className="w-4 h-4" /> LÁI THỬ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
};

export default CarList;
