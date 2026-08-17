"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import QuoteModal from "./quote_modal";

interface CarNavData {
  id: number;
  name: string;
  slug: string;
  car_type: string;
  car_type_order: number;
}

const generateSlugId = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

const Navbar: React.FC = () => {
  const [groupedCars, setGroupedCars] = useState<Record<string, CarNavData[]>>(
    {},
  );
  const pathname = usePathname();
  const router = useRouter();

  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // State quản lý Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarsForNav = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(
          `${API_URL}/api/cars?fields[0]=name&fields[1]=slug&populate[car_type][fields][0]=name&populate[car_type][fields][1]=order`,
        );
        const data = await res.json();

        if (!data || !data.data || !Array.isArray(data.data)) return;

        const cars: CarNavData[] = data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          car_type: item.car_type?.name || "Khác",
          car_type_order: item.car_type?.order || 999,
        }));

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

        cars.sort((a, b) => {
          const getSortIndex = (car: CarNavData) => {
            const currentSlug = car.slug.toLowerCase();

            if (car.car_type === "Xe ô tô điện VinFast") {
              const index = orderOToDien.findIndex((key) =>
                currentSlug.includes(key.toLowerCase()),
              );
              return index === -1 ? 999 : index;
            } else {
              const index = orderKhac.findIndex((key) =>
                currentSlug.includes(key.toLowerCase()),
              );
              return index === -1 ? 999 : index;
            }
          };

          const indexA = getSortIndex(a);
          const indexB = getSortIndex(b);

          if (indexA !== indexB) {
            return indexA - indexB;
          }

          return a.name.localeCompare(b.name);
        });

        const grouped = cars.reduce(
          (acc, car) => {
            if (!acc[car.car_type]) acc[car.car_type] = [];
            acc[car.car_type].push(car);
            return acc;
          },
          {} as Record<string, CarNavData[]>,
        );

        setGroupedCars(grouped);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu menu xe:", error);
      }
    };

    fetchCarsForNav();
  }, []);

  // Xác định carType nào đang Active (nếu đang ở trang chi tiết xe)
  let activeCarType = "";
  if (pathname.startsWith("/car/")) {
    const currentSlug = pathname.split("/").pop();
    for (const [type, cars] of Object.entries(groupedCars)) {
      if (cars.some((car) => car.slug === currentSlug)) {
        activeCarType = type;
        break;
      }
    }
  }

  const handleCarTypeClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    const targetId = generateSlugId(type);

    if (pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${targetId}`);
    }
    // Đóng mobile menu sau khi chọn xong hành động
    setIsMobileMenuOpen(false);
  };

  const toggleMobileDropdown = (type: string) => {
    setMobileDropdown(mobileDropdown === type ? null : type);
  };

  const sortedCarTypes = Object.entries(groupedCars).sort((a, b) => {
    const orderA = a[1][0]?.car_type_order ?? 999;
    const orderB = b[1][0]?.car_type_order ?? 999;
    return orderA - orderB;
  });

  return (
    <>
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 flex items-center cursor-pointer"
            >
              <img
                className="h-8 md:h-10 w-auto"
                src="/vinfast-logo1.png"
                alt="VinFast Logo"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-7 items-center">
              <Link
                href="/"
                className={`font-semibold text-[15px] transition-colors ${
                  pathname === "/"
                    ? "text-[#2152ff]"
                    : "text-gray-800 hover:text-[#2152ff]"
                }`}
              >
                Trang chủ
              </Link>

              {sortedCarTypes.map(([carType, carsInType]) => {
                const isCarTypeActive = activeCarType === carType;

                return (
                  <div
                    key={carType}
                    className="relative group flex items-center space-x-1 cursor-pointer font-medium text-[15px] py-6"
                  >
                    <button
                      onClick={(e) => handleCarTypeClick(e, carType)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        isCarTypeActive
                          ? "text-[#2152ff] font-semibold"
                          : "text-gray-800 group-hover:text-[#2152ff]"
                      }`}
                    >
                      <span>{carType}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
                      {carsInType.map((car) => (
                        <Link
                          key={car.id}
                          href={`/car/${car.slug}`}
                          className={`px-4 py-2 transition-colors ${
                            pathname === `/car/${car.slug}`
                              ? "bg-gray-50 text-[#3b66ff] font-medium"
                              : "text-gray-700 hover:bg-gray-50 hover:text-[#3b66ff]"
                          }`}
                        >
                          {car.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              <Link
                href="/price_list"
                className={`font-medium text-[15px] transition-colors ${
                  pathname === "/price_list"
                    ? "text-[#2152ff] font-semibold"
                    : "text-gray-800 hover:text-[#2152ff]"
                }`}
              >
                Bảng giá xe
              </Link>
              <Link
                href="/contact"
                className={`font-medium text-[15px] transition-colors ${
                  pathname === "/contact"
                    ? "text-[#2152ff] font-semibold"
                    : "text-gray-800 hover:text-[#2152ff]"
                }`}
              >
                Liên hệ
              </Link>
            </div>

            {/* Desktop Button */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsQuoteOpen(true)}
                className="bg-[#3b66ff] hover:bg-blue-700 text-white px-6 py-2.5 rounded text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                BÁO GIÁ LĂN BÁNH
              </button>
            </div>

            {/* Nút Hamburger cho Mobile */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-800 hover:text-[#3b66ff] focus:outline-none cursor-pointer p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto z-40">
            <div className="px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-semibold text-[16px] transition-colors ${pathname === "/" ? "text-[#2152ff]" : "text-gray-800 hover:text-[#2152ff]"}`}
              >
                Trang chủ
              </Link>

              {sortedCarTypes.map(([carType, carsInType]) => {
                const isCarTypeActive = activeCarType === carType;

                return (
                  <div key={carType} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center w-full py-1">
                      {/* Bấm vào tên loại xe: Chuyển hướng hoặc cuộn trang y hệt Desktop */}
                      <button
                        onClick={(e) => handleCarTypeClick(e, carType)}
                        className={`font-semibold text-[16px] text-left transition-colors cursor-pointer ${
                          isCarTypeActive
                            ? "text-[#2152ff]"
                            : "text-gray-800 hover:text-[#2152ff]"
                        }`}
                      >
                        {carType}
                      </button>

                      {/* Bấm vào icon Chevron: Chỉ để đóng/mở Accordion danh sách xe chi tiết */}
                      <button
                        onClick={() => toggleMobileDropdown(carType)}
                        className="p-2 text-gray-500 hover:text-[#2152ff] focus:outline-none cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${mobileDropdown === carType ? "rotate-180 text-[#2152ff]" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Danh sách xe con xổ xuống trên Mobile */}
                    {mobileDropdown === carType && (
                      <div className="flex flex-col pl-4 mt-2 mb-2 space-y-3">
                        {carsInType.map((car) => (
                          <Link
                            key={car.id}
                            href={`/car/${car.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[15px] transition-colors ${
                              pathname === `/car/${car.slug}`
                                ? "text-[#3b66ff] font-medium"
                                : "text-gray-600 hover:text-[#3b66ff]"
                            }`}
                          >
                            {car.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/price_list"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-semibold text-[16px] py-2 border-b border-gray-100 block transition-colors ${
                  pathname === "/price_list"
                    ? "text-[#2152ff]"
                    : "text-gray-800 hover:text-[#2152ff]"
                }`}
              >
                Bảng giá xe
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-semibold text-[16px] py-2 block transition-colors ${
                  pathname === "/contact"
                    ? "text-[#2152ff]"
                    : "text-gray-800 hover:text-[#2152ff]"
                }`}
              >
                Liên hệ
              </Link>

              <button
                onClick={() => {
                  setIsQuoteOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-[#3b66ff] text-white py-3 mt-4 rounded text-[15px] font-bold uppercase cursor-pointer"
              >
                Báo giá lăn bánh
              </button>
            </div>
          </div>
        )}
      </nav>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
};

export default Navbar;
