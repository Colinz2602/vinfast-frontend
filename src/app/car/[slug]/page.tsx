"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Gift,
  Phone,
  X,
} from "lucide-react";
import MediaTextSection1 from "@/app/car/[slug]/media_text_section1";
import MediaTextSection2 from "@/app/car/[slug]/media_text_section2";
import MediaTextSection3 from "@/app/car/[slug]/media_text_section3";
import QuoteModal from "@/app/components/quote_modal";

const DynamicMediaSection = ({
  title,
  data,
  titleClassName = "text-4xl md:text-3xl font-medium text-gray-900 uppercase mb-4",
  containerClassName = "w-full mt-12 mb-12",
}: {
  title?: string;
  data: any;
  titleClassName?: string;
  containerClassName?: string;
}) => {
  if (!data) return null;

  // Xử lý cả trường hợp Single Component và Repeatable Component
  const dataArray = Array.isArray(data) ? data : [data];

  // Nếu mảng rỗng thì không render
  if (dataArray.length === 0) return null;

  return (
    <div className={containerClassName}>
      {/* Chỉ render Title 1 lần cho cả cụm section */}
      {title && <h2 className={titleClassName}>{title}</h2>}

      <div className="flex flex-col gap-10">
        {dataArray.map((item: any, index: number) => {
          const style = item.layout_style || "media_text_section1";

          if (style === "media_text_section2") {
            // Không truyền title vào các block con nữa để tránh bị lặp title
            return <MediaTextSection2 key={index} data={item} />;
          }

          if (style === "media_text_section3") {
            return <MediaTextSection3 key={index} data={item} />;
          }

          return (
            <MediaTextSection1
              key={index}
              data={item}
              containerClassName="w-full" // Ghi đè class margin để các khối gần nhau hơn
            />
          );
        })}
      </div>
    </div>
  );
};

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [car, setCar] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const carQuery = new URLSearchParams({
          "filters[slug][$eq]": slug as string,
          "populate[gallery][populate]": "*",
          "populate[thumbnail]": "true",
          "populate[promotion]": "*",
          "populate[general_specifications]": "*",
          "populate[description][populate]": "*",
          "populate[exterior][populate]": "*",
          "populate[interior][populate]": "*",
          "populate[technology_operations][populate]": "*",
          "populate[safe][populate]": "*",
          "populate[charging_station][populate]": "*",
          "populate[main_image][populate]": "*",
          "populate[specifications][populate]": "*",
          "populate[privilege][populate]": "*",
          "populate[photo_gallery][populate]": "*",
          "populate[car_type][fields][0]": "name",
        }).toString();
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const apiUrl = `${API_URL}/api/cars?${carQuery}`;
        console.log("🔗 Đang gọi API URL:", apiUrl);

        const carRes = await fetch(apiUrl);
        const carData = await carRes.json();

        // Kiểm tra xem data có tồn tại và có mảng dữ liệu hay không
        if (carData.error) {
          console.error("❌ API trả về lỗi:", carData.error);
        } else if (carData.data && carData.data.length > 0) {
          const item = carData.data[0];
          console.log("✅ Dữ liệu 1 chiếc xe:", item);

          setCar(item);
        } else {
          console.warn(
            "⚠️ API gọi thành công nhưng không tìm thấy xe nào với slug:",
            slug,
          );
        }

        const settingRes = await fetch(`${API_URL}/api/global-setting`);
        const settingData = await settingRes.json();
        setSettings(settingData?.data || {});
      } catch (error) {
        console.error("🔥 Lỗi khi tải dữ liệu catch block:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    const activeThumb = document.getElementById(
      `main-thumbnail-${currentImageIndex}`,
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentImageIndex]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Đang tải dữ liệu...
      </div>
    );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price || 0);

  let imageList: string[] = [];
  const galleryImages = car?.gallery?.images;
  const API_URL =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  if (Array.isArray(galleryImages)) {
    imageList = galleryImages
      .map((img: any) => {
        const url = img?.url;
        if (!url) return "";
        return url.startsWith("http") ? url : `${API_URL}${url}`;
      })
      .filter(Boolean);
  }

  if (imageList.length === 0 && car?.thumbnail) {
    const thumbUrl = car.thumbnail.url;
    if (thumbUrl) {
      imageList = [
        thumbUrl.startsWith("http") ? thumbUrl : `${API_URL}${thumbUrl}`,
      ];
    }
  }

  const prevImage = () => {
    if (imageList.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageList.length - 1 : prev - 1,
    );
  };

  const nextImage = () => {
    if (imageList.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === imageList.length - 1 ? 0 : prev + 1,
    );
  };

  let allGalleryImages: string[] = [];
  if (car?.photo_gallery && Array.isArray(car.photo_gallery)) {
    car.photo_gallery.forEach((item: any) => {
      const imgs = item.images || [];
      const imgArray = Array.isArray(imgs)
        ? imgs
        : imgs?.data
          ? Array.isArray(imgs.data)
            ? imgs.data
            : [imgs.data]
          : [];

      imgArray.forEach((img: any) => {
        let url = img?.url;
        if (url) {
          allGalleryImages.push(
            url.startsWith("http") ? url : `${API_URL}${url}`,
          );
        }
      });
    });
  }

  const prevGalleryImage = () => {
    if (allGalleryImages.length === 0) return;
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? allGalleryImages.length - 1 : prev - 1,
    );
  };

  const nextGalleryImage = () => {
    if (allGalleryImages.length === 0) return;
    setCurrentGalleryIndex((prev) =>
      prev === allGalleryImages.length - 1 ? 0 : prev + 1,
    );
  };

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
  const carTypeName = car?.car_type?.name;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="grow">
        {/* Container Chính */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-[13px] text-gray-500 uppercase tracking-wide mb-8 flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-[#3b66ff] transition-colors font-medium"
            >
              TRANG CHỦ
            </Link>
            <span>/</span>
            {carTypeName && (
              <Link
                href={`/#${generateSlugId(carTypeName)}`}
                className="hover:text-[#3b66ff] transition-colors font-medium"
              >
                {carTypeName}
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-3/5">
              {/* Ảnh chính */}
              <div className="relative w-full aspect-video flex items-center justify-center mb-4 group">
                {imageList.length > 0 ? (
                  <img
                    src={imageList[currentImageIndex]}
                    alt={car?.name || "Car Image"}
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    onClick={() => setIsFullscreen(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    Chưa có hình ảnh
                  </div>
                )}

                {/* Điều hướng Slider */}
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors bg-white/50 rounded-r-md"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors bg-white/50 rounded-l-md"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Nút phóng to */}
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="absolute bottom-2 left-2 p-2 text-gray-600 bg-white/70 border border-gray-300 rounded-full hover:bg-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dải ảnh nhỏ */}
              {imageList.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {imageList.map((src, idx) => (
                    <button
                      key={idx}
                      id={`main-thumbnail-${idx}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative shrink-0 w-24 h-16 border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-blue-500 opacity-100"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin và Giá */}
            <div className="w-full lg:w-2/5">
              <h1 className="text-3xl font-medium text-gray-800 mb-2">
                {car?.name}
              </h1>

              <div className="flex flex-col gap-1 mb-6">
                {car?.discount_price ? (
                  <>
                    <span className="text-[20px] md:text-[22px] font-medium text-[#8ba4ff] line-through">
                      {formatPrice(car.starting_price)} VNĐ
                    </span>
                    <span className="text-[28px] font-semibold text-[#3b66ff]">
                      {formatPrice(car.discount_price)} VNĐ
                    </span>
                  </>
                ) : (
                  <span className="text-[28px] font-semibold text-[#3b66ff]">
                    {formatPrice(car?.starting_price)} VNĐ
                  </span>
                )}
              </div>

              {/* Bảng giá động từ trường JSON version */}
              <div className="bg-[#e5e7eb] p-3 mb-3 rounded-sm">
                <h3 className="text-[13px] font-bold text-gray-800 uppercase mb-2">
                  BẢNG GIÁ XE {car?.name ? car.name.toUpperCase() : ""}
                </h3>
                <ul className="list-disc pl-5 text-[13px] text-gray-700">
                  {car?.version &&
                  Array.isArray(car.version) &&
                  car.version.length > 0 ? (
                    car.version.map((v: any, index: number) => (
                      <li key={index} className="mb-1 last:mb-0">
                        {v.name}:{" "}
                        <span className="text-[#3b66ff]">
                          {formatPrice(v.price)} VNĐ
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>
                      {car?.name}:{" "}
                      <span className="text-[#3b66ff]">
                        {formatPrice(
                          car?.discount_price || car?.starting_price,
                        )}{" "}
                        VNĐ
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Thông số nhanh */}
              {car?.general_specifications && (
                <div className="bg-[#e5e7eb] p-3 text-[13px] text-gray-800 flex items-center divide-x divide-gray-400 font-medium mb-4">
                  <span className="pr-3">
                    {car.general_specifications.distance_charge ||
                      "Đang cập nhật km"}
                    /1 lần sạc
                  </span>
                  <span className="pl-3">
                    Công suất tối đa{" "}
                    {car.general_specifications.capacity || "Đang cập nhật"}
                  </span>
                </div>
              )}

              {/* Khuyến mãi (Hardcode) */}
              <div className="bg-[#3b66ff] text-white p-3 mb-6">
                <h3 className="text-[15px] uppercase mb-1">
                  KHUYẾN MÃI VÀ ƯU ĐÃI
                </h3>
                <p className="text-[15px]">
                  Quý khách liên hệ, nhận thông tin khuyến mãi và ưu đãi.
                </p>
              </div>

              {/* Nút Hành Động */}
              <div className="flex gap-3 mb-6">
                {/* Thêm onClick gọi QuoteModal */}
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="flex-1 bg-[#3b66ff] hover:bg-blue-700 text-white py-2.5 rounded-sm text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Gift className="w-4 h-4" /> BÁO GIÁ LĂN BÁNH
                </button>
                <a
                  href={`tel:${settings?.hotline || ""}`}
                  className="flex-1 bg-[#3b66ff] hover:bg-blue-700 text-white py-2.5 rounded-sm text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> {settings?.hotline || "LIÊN HỆ"}
                </a>
              </div>
            </div>
          </div>

          {/* PHẦN KHUYẾN MÃI (DASHED BOX TỪ COMPONENT PROMOTION) */}
          {car?.promotion?.promotion_description && (
            <div className="w-full mt-10 mb-2 border-2 border-dashed border-gray-600 rounded-xl p-6 md:p-8 bg-white">
              <div className="text-center mb-6">
                <div className="text-[#df4e3b] text-lg md:text-xl font-bold uppercase leading-relaxed whitespace-pre-line">
                  {car.promotion.promotion_description}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <a
                  href={`tel:${settings?.hotline || ""}`}
                  className="flex-1 bg-[#ed7a43] hover:bg-[#d86a34] text-white py-4 px-4 rounded-md flex flex-col items-center justify-center transition-colors text-center shadow-sm"
                >
                  <span className="text-xl md:text-2xl font-bold mb-1">
                    Hotline {settings?.hotline}
                  </span>
                  <span className="text-[14px]">
                    Quý khách vui lòng gọi để có giá xe tốt nhất
                  </span>
                </a>
                {/* Thêm onClick gọi QuoteModal */}
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="flex-1 bg-[#4c8bd3] hover:bg-[#3c75b5] text-white py-4 px-4 rounded-md flex flex-col items-center justify-center transition-colors text-center shadow-sm cursor-pointer"
                >
                  <span className="text-xl md:text-2xl font-bold mb-1">
                    NHẬN BÁO GIÁ
                  </span>
                  <span className="text-[14px]">
                    Hoặc đăng ký nhận Báo giá xe Vinfast lăn bánh tốt nhất
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* PHẦN MAIN IMAGE, DESCRIPTION & SPECIFICATIONS */}
          <div className="border-t border-gray-200">
            {/* Main Image*/}
            {(() => {
              let mainImageUrls: string[] = [];
              const mainImgData = car?.main_image?.images;

              // Bóc tách tất cả các URL ảnh từ Strapi
              if (Array.isArray(mainImgData)) {
                mainImageUrls = mainImgData
                  .map((img: any) => img?.url)
                  .filter(Boolean);
              } else if (mainImgData?.data && Array.isArray(mainImgData.data)) {
                mainImageUrls = mainImgData.data
                  .map((img: any) => img?.url)
                  .filter(Boolean);
              } else if (mainImgData?.data) {
                const url = mainImgData.data.url;
                if (url) mainImageUrls.push(url);
              } else if (mainImgData?.url) {
                mainImageUrls.push(mainImgData.url);
              }

              // Thêm domain localhost nếu URL là đường dẫn tương đối
              mainImageUrls = mainImageUrls.map((url) =>
                url.startsWith("http") ? url : `${API_URL}${url}`,
              );

              if (mainImageUrls.length === 0) return null;

              // Nếu có >= 2 ảnh thì chia 2 cột trên màn hình vừa/lớn, nếu 1 ảnh thì full width
              const gridClass =
                mainImageUrls.length >= 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "w-full";

              return (
                <div className={`w-full mb-10 ${gridClass}`}>
                  {mainImageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Banner ${car?.name} ${idx + 1}`}
                      // Thay đổi class ở đây: Bỏ chiều cao cố định và object-cover để ảnh không bị cắt/phóng to
                      className="w-full h-auto object-contain rounded-sm"
                    />
                  ))}
                </div>
              );
            })()}

            {/* Tiêu đề và Description */}
            <DynamicMediaSection title={car?.name} data={car?.description} />

            {/* General Specifications*/}
            {(() => {
              // Lọc ra những trường có dữ liệu trước khi map để grid không bị hỏng layout
              const specsList = [
                { key: "distance_charge", label: "Quãng đường/1 lần sạc" },
                { key: "charging_time", label: "Thời gian nạp pin nhanh nhất" },
                { key: "capacity", label: "Công suất tối đa" },
                { key: "number_of_seats", label: "Số chỗ ngồi" },
                { key: "battery", label: "Dung lượng pin" },
                { key: "acceleration_time", label: "Thời gian tăng tốc" },
                { key: "powerful_operation", label: "Động cơ" },
                { key: "guarantee", label: "Bảo hành" },
              ].filter((spec) => car?.general_specifications?.[spec.key]);

              if (specsList.length === 0) return null;

              // Tính toán số cột tối đa trên Desktop (chia đều tối đa 4 cột)
              const desktopCols = Math.min(specsList.length, 4);

              // Gán class chia cột linh hoạt cho Tailwind để không bị lỗi build
              let desktopGridClass = "lg:grid-cols-4";
              if (desktopCols === 1) desktopGridClass = "lg:grid-cols-1";
              else if (desktopCols === 2) desktopGridClass = "lg:grid-cols-2";
              else if (desktopCols === 3) desktopGridClass = "lg:grid-cols-3";

              return (
                <div className="w-full bg-[#f8f9fa] py-6 md:py-8 rounded-sm">
                  {/* Cập nhật class chia cột động ở đây */}
                  <div
                    className={`grid grid-cols-2 ${desktopGridClass} gap-y-10`}
                  >
                    {specsList.map(({ key, label }, index) => {
                      const value = car.general_specifications[key];

                      // Modulo theo số cột động thay vì fix cứng số 4 để ẩn viền chuẩn xác
                      const isFirstInRowDesktop = index % desktopCols === 0;
                      const isFirstInRowMobile = index % 2 === 0;

                      return (
                        <div
                          key={key}
                          className={`flex flex-col px-4 md:px-6 
                            border-gray-300
                            ${!isFirstInRowMobile ? "border-l" : ""} 
                            lg:border-l 
                            ${isFirstInRowDesktop ? "lg:border-l-0" : ""}
                          `}
                        >
                          <span className="text-2xl md:text-4xl font-medium text-gray-900">
                            {value}
                          </span>
                          <span className="text-[15px] text-gray-500 mt-1">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          <DynamicMediaSection title="Ngoại thất" data={car?.exterior} />

          {/* PHẦN NỘI THẤT */}
          <DynamicMediaSection title="Nội thất" data={car?.interior} />

          {/* PHẦN TRẠM SẠC*/}
          <DynamicMediaSection title="Trạm sạc" data={car?.charging_station} />

          {/* PHẦN CÔNG NGHỆ & VẬN HÀNH */}
          <DynamicMediaSection
            title="Công nghệ & Vận hành"
            data={car?.technology_operations}
          />

          {/* PHẦN AN TOÀN */}
          <DynamicMediaSection title="An toàn" data={car?.safe} />

          {/* PHẦN THÔNG SỐ KỸ THUẬT (SPECIFICATIONS) */}
          <DynamicMediaSection
            title="Thông số kỹ thuật"
            data={car?.specifications}
          />

          {/* PHẦN Đặc quyền (Privilege) */}
          <DynamicMediaSection title="Đặc quyền" data={car?.privilege} />

          {/* PHẦN THƯ VIỆN ẢNH (PHOTO GALLERY) */}
          {allGalleryImages.length > 0 && (
            <div className="w-full mt-12 mb-16">
              <h2 className="text-4xl md:text-4xl font-medium text-gray-900 uppercase mb-6">
                Thư viện ảnh
              </h2>

              {/* CSS Grid chia 3 cột */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allGalleryImages.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentGalleryIndex(idx);
                      setIsGalleryFullscreen(true); // Bật Modal khi Click
                    }}
                    className="w-full h-48 md:h-64 overflow-hidden rounded-sm shadow-sm group cursor-pointer"
                  >
                    <img
                      src={src}
                      alt={`Thư viện ảnh ${car?.name} - ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* HẾT PHẦN THƯ VIỆN ẢNH */}
        </div>
      </div>

      {/* Gọi component QuoteModal ở đây */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      {/* Modal Phóng To Ảnh*/}
      {isFullscreen && imageList.length > 0 && (
        <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Nút Đóng */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Nút điều hướng trái/phải*/}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Ảnh Phóng To */}
          <img
            src={imageList[currentImageIndex]}
            alt="Enlarged Car"
            className="w-[95vw] h-[90vh] object-contain select-none"
          />
        </div>
      )}

      {/* Modal Phóng To Ảnh Thư Viện */}
      {isGalleryFullscreen && allGalleryImages.length > 0 && (
        <div className="fixed inset-0 z-9999 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Nút Đóng */}
          <button
            onClick={() => setIsGalleryFullscreen(false)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Nút điều hướng trái/phải*/}
          {allGalleryImages.length > 1 && (
            <>
              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-all cursor-pointer z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Ảnh Phóng To */}
          <img
            src={allGalleryImages[currentGalleryIndex]}
            alt="Enlarged Gallery Car"
            className="w-[95vw] h-[90vh] object-contain select-none"
          />
        </div>
      )}
    </main>
  );
}
