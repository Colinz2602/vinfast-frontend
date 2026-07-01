"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CarNavData {
  id: number;
  name: string;
  slug: string;
  car_type: string;
}

// Hàm tạo ID giống với bên cars_list
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

  useEffect(() => {
    const fetchCarsForNav = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(
          `${API_URL}/api/cars?fields[0]=name&fields[1]=slug&populate[car_type][fields][0]=name`,
        );
        const data = await res.json();

        // Nếu API lỗi hoặc data.data là null thì dừng lại
        if (!data || !data.data || !Array.isArray(data.data)) {
          console.error(
            "API trả về lỗi hoặc không có mảng dữ liệu:",
            data?.error || data,
          );
          return;
        }

        const cars: CarNavData[] = data.data.map((item: any) => {
          // Trích xuất name, slug
          const name = item.name;
          const slug = item.slug;

          // Trích xuất tên của car_type từ object relation
          const carTypeData = item.car_type;
          const carTypeName = carTypeData?.name || "Khác";

          return {
            id: item.id,
            name: name,
            slug: slug,
            car_type: carTypeName,
          };
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

  // Hàm xử lý khi click vào Car Type trên Navbar
  const handleCarTypeClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    const targetId = generateSlugId(type);

    if (pathname === "/") {
      // Nếu đang ở trang chủ, cuộn mượt xuống section đó
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Nếu đang ở trang khác, chuyển hướng về trang chủ kèm hashtag
      router.push(`/#${targetId}`);
    }
  };

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center cursor-pointer">
            <img
              className="h-10 w-auto"
              src="/vinfast-logo1.png"
              alt="VinFast Logo"
            />
          </Link>

          {/* Menu Links */}
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

            {/* Menu động từ dữ liệu API */}
            {Object.entries(groupedCars).map(([carType, carsInType]) => {
              const isActive = pathname !== "/" && activeCarType === carType;

              return (
                <div
                  key={carType}
                  className="relative group flex items-center space-x-1 cursor-pointer font-medium text-[15px] py-6"
                >
                  <button
                    onClick={(e) => handleCarTypeClick(e, carType)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      isActive
                        ? "text-[#2152ff]"
                        : "text-gray-800 group-hover:text-[#2152ff]"
                    }`}
                  >
                    <span>{carType}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-lg rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 flex flex-col py-2">
                    {carsInType.map((car) => (
                      <Link
                        key={car.id}
                        href={`/car/${car.slug}`}
                        className={`px-4 py-2 transition-colors ${
                          pathname === `/car/${car.slug}`
                            ? "bg-gray-50 text-[#3b66ff]"
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
              className="text-gray-800 hover:text-[#2152ff] font-medium text-[15px] transition-colors"
            >
              Bảng giá xe
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-[#2152ff] font-medium text-[15px] transition-colors"
            >
              Liên hệ
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <button className="bg-[#3b66ff] hover:bg-blue-700 text-white px-6 py-2.5 rounded text-sm font-semibold transition-all shadow-md">
              BÁO GIÁ LĂN BÁNH
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
