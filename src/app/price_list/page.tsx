// File: app/bang-gia-xe/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

interface CarVersion {
  name: string;
  price: number;
}

interface CarData {
  id: number;
  name: string;
  starting_price: number;
  version: CarVersion[];
  car_type: string;
}

export default function PriceListPage() {
  const [groupedCars, setGroupedCars] = useState<Record<string, CarData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(
          `${API_URL}/api/cars?populate=*&pagination[pageSize]=100`,
        );
        const data = await res.json();

        const fetchedCars: CarData[] = data.data.map((item: any) => {
          const attrs = item;
          const carTypeData = attrs.car_type;
          const carTypeName = carTypeData?.name || "Các dòng xe khác";

          const sortedVersions = (attrs.version || []).sort(
            (a: CarVersion, b: CarVersion) =>
              a.name.localeCompare(b.name, "vi", { numeric: true }),
          );

          return {
            id: item.id,
            name: attrs.name || "",
            starting_price: attrs.starting_price || 0,
            version: sortedVersions,
            car_type: carTypeName,
          };
        });

        fetchedCars.sort((a, b) =>
          a.name.localeCompare(b.name, "vi", { numeric: true }),
        );

        const grouped = fetchedCars.reduce(
          (acc, car) => {
            if (!acc[car.car_type]) acc[car.car_type] = [];
            acc[car.car_type].push(car);
            return acc;
          },
          {} as Record<string, CarData[]>,
        );

        setGroupedCars(grouped);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải bảng giá xe:", error);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price || 0);

  const sortedCarTypes = Object.keys(groupedCars).sort((a, b) =>
    a.localeCompare(b, "vi", { numeric: true }),
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-10 text-gray-800">
          <h1 className="text-[28px] md:text-[32px] font-bold uppercase mb-4">
            BẢNG GIÁ XE VINFAST
          </h1>
          <h2 className="text-[20px] md:text-[22px] font-bold uppercase mb-4">
            CHƯƠNG TRÌNH KHUYẾN MÃI VÀ ƯU ĐÃI
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] mb-8">
            <li>Khách hàng mua xe sẽ được hỗ trợ lệ phí trước bạ (*).</li>
            <li>Nhiều phần quà giá trị khác (*).</li>
          </ul>

          <h2 className="text-[20px] md:text-[22px] font-bold uppercase mb-4">
            BẢNG GIÁ XE VINFAST MỚI NHẤT
          </h2>
        </div>

        {/* Khối Bảng Giá */}
        {isLoading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-12 bg-gray-200 w-full rounded"></div>
            <div className="h-10 bg-gray-100 w-full rounded"></div>
            <div className="h-10 bg-gray-100 w-full rounded"></div>
          </div>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-[15px]">
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 uppercase w-2/3">
                    CÁC DÒNG XE VINFAST
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 uppercase w-1/3">
                    GIÁ (VNĐ)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCarTypes.map((carType) => {
                  const carsInType = groupedCars[carType];
                  return (
                    <React.Fragment key={carType}>
                      {/* Dòng 1: Header của Nhóm xe (car_type) */}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={2}
                          className="border border-gray-300 p-3 font-bold text-gray-800 uppercase"
                        >
                          {carType}
                        </td>
                      </tr>

                      {/* Các dòng tiếp theo: Xe hoặc Phiên bản của xe (version) */}
                      {carsInType.map((car) => {
                        if (
                          car.version &&
                          Array.isArray(car.version) &&
                          car.version.length > 0
                        ) {
                          // Nếu xe có phiên bản (VD: Eco, Plus), lặp qua các phiên bản
                          return car.version.map((v, idx) => (
                            <tr key={`${car.id}-${idx}`}>
                              <td className="border border-gray-300 p-3 text-gray-700">
                                {v.name}
                              </td>
                              <td className="border border-gray-300 p-3 text-gray-700">
                                {formatPrice(v.price)} VNĐ
                              </td>
                            </tr>
                          ));
                        } else {
                          // Nếu xe không chia phiên bản, lấy tên xe và giá khởi điểm
                          return (
                            <tr key={car.id}>
                              <td className="border border-gray-300 p-3 text-gray-700">
                                {car.name}
                              </td>
                              <td className="border border-gray-300 p-3 text-gray-700">
                                {formatPrice(car.starting_price)} VNĐ
                              </td>
                            </tr>
                          );
                        }
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="italic text-[14px] text-gray-600 mb-10 mt-6">
          Lưu ý: Bảng giá có thể thay đổi theo từng thời điểm, Quý khách liên hệ
          hotline để nhận thông tin ưu đãi và báo giá lăn bánh xe ô tô VinFast.
        </p>
      </div>
    </main>
  );
}
