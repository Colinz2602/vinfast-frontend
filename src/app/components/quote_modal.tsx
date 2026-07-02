"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Search, X } from "lucide-react";

interface CarOption {
  id: number;
  name: string;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [cars, setCars] = useState<CarOption[]>([]);
  const [hotline, setHotline] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Trả thẳng");

  // Error state
  const [phoneError, setPhoneError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dữ liệu xe và hotline từ Strapi
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

        // Lấy danh sách xe
        const carRes = await fetch(
          `${API_URL}/api/cars?fields[0]=name&sort=name:asc`,
        );
        const carData = await carRes.json();
        if (carData?.data) {
          setCars(carData.data.map((c: any) => ({ id: c.id, name: c.name })));
        }

        // Lấy hotline từ global setting
        const settingRes = await fetch(`${API_URL}/api/global-setting`);
        const settingData = await settingRes.json();
        if (settingData?.data?.hotline) {
          setHotline(settingData.data.hotline);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu form báo giá:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // Xử lý khi bấm Gửi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate bắt buộc nhập số điện thoại
    if (!phone.trim()) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    // Chuẩn hóa số điện thoại Zalo
    const formattedHotline = hotline.replace(/[\s\.]/g, "");

    // Tạo nội dung tin nhắn
    const message = `Chào bạn, tôi muốn nhận báo giá lăn bánh và tư vấn xe:\n- Họ và tên: ${name || "Khách hàng"}\n- Số điện thoại: ${phone}\n- Xe quan tâm: ${selectedCar || "Chưa xác định"}\n- Hình thức mua: ${paymentMethod}`;

    try {
      // Tự động copy nội dung vào Clipboard của trình duyệt
      await navigator.clipboard.writeText(message);

      // Có thể thêm 1 thông báo nhỏ cho khách hàng biết (dùng alert hoặc toast UI của bạn)
      alert(
        "Đã lưu thông tin báo giá! Vui lòng nhấn 'Dán' (Ctrl+V) vào khung chat Zalo để gửi cho chúng tôi nhé.",
      );
    } catch (err) {
      console.error("Không thể tự động copy tin nhắn:", err);
    }

    // Tạo link mở Zalo (Vẫn giữ ?text= để fallback cho thiết bị Mobile)
    const zaloUrl = `https://zalo.me/${formattedHotline}?text=${encodeURIComponent(message)}`;

    // Mở tab Zalo mới
    window.open(zaloUrl, "_blank");

    // Đóng modal sau khi gửi
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-3xl rounded-md shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cột trái: Hình ảnh quảng cáo (Ẩn trên mobile để tiết kiệm diện tích) */}
        <div className="hidden md:flex md:w-1/2 bg-gray-50 relative items-center justify-center p-4">
          <img
            src="/vinfat-banner-m2604-005-768x768.jpg"
            alt="VinFast 10 Năm Bảo Hành"
            className="max-w-full max-h-full object-contain rounded-md"
            onError={(e) => {
              // Fallback nếu chưa có ảnh
              (e.target as HTMLImageElement).src =
                "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw112f483c/images/PDP/VF8/banner-b2.jpg";
            }}
          />
        </div>

        {/* Cột phải: Form nhập liệu */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-[18px] font-bold text-[#2152ff] uppercase mb-6 text-center md:text-left">
            BÁO GIÁ LĂN BÁNH & LÁI THỬ XE
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input: Họ và tên */}
            <div className="relative border-b border-gray-300 pb-1">
              <User className="absolute left-1 top-2.5 w-5 h-5 text-gray-800" />
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 outline-none text-[15px] bg-transparent"
              />
            </div>

            {/* Input: Số điện thoại */}
            <div
              className={`relative border-b pb-1 transition-colors ${phoneError ? "border-red-500" : "border-gray-300"}`}
            >
              <Phone className="absolute left-1 top-2.5 w-5 h-5 text-gray-800" />
              <input
                type="tel"
                placeholder="Di động *"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(false);
                }}
                className="w-full pl-9 pr-3 py-2 outline-none text-[15px] bg-transparent"
              />
            </div>
            {phoneError && (
              <span className="text-red-500 text-[13px] italic -mt-2">
                Vui lòng nhập dữ liệu cho trường này.
              </span>
            )}

            {/* Select: Chọn xe */}
            <div className="relative border-b border-gray-300 pb-1 mt-2">
              <Search className="absolute left-1 top-2.5 w-5 h-5 text-gray-800" />
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full pl-9 pr-3 py-2 outline-none text-[15px] bg-transparent cursor-pointer appearance-none"
                disabled={isLoading}
              >
                <option value="" disabled>
                  {isLoading ? "Đang tải danh sách xe..." : "Chọn xe"}
                </option>
                {cars.map((car) => (
                  <option key={car.id} value={car.name}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Radio: Hình thức thanh toán */}
            <div className="flex items-center justify-center gap-8 mt-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer text-[15px] text-gray-700">
                <input
                  type="radio"
                  name="payment"
                  value="Trả góp"
                  checked={paymentMethod === "Trả góp"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#3b66ff] focus:ring-[#3b66ff]"
                />
                Trả góp
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[15px] text-gray-700">
                <input
                  type="radio"
                  name="payment"
                  value="Trả thẳng"
                  checked={paymentMethod === "Trả thẳng"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#3b66ff] focus:ring-[#3b66ff]"
                />
                Trả thẳng
              </label>
            </div>

            {/* Button Gửi */}
            <button
              type="submit"
              className="w-full bg-[#3b66ff] hover:bg-blue-700 text-white font-semibold py-3 rounded-sm transition-colors uppercase text-[15px]"
            >
              Nhận thông tin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
