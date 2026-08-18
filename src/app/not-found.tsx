import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grow bg-gray-50 flex items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Cột trái: Thông báo lỗi và Nút điều hướng */}
        <div>
          <h1 className="text-[100px] md:text-[140px] font-bold text-[#3b66ff] leading-none mb-2 drop-shadow-sm">
            404
          </h1>
          <h2 className="text-[22px] md:text-[28px] font-bold text-gray-900 uppercase mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-[15px] mb-8 leading-relaxed max-w-md">
            Chúng tôi xin lỗi vì sự bất tiện này! Có lẽ trang bạn đang tìm kiếm
            không tồn tại hoặc đã bị dời đi.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#3b66ff] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-sm transition-colors text-[14px] uppercase shadow-md"
          >
            Về trang chủ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cột phải: Gợi ý các trang quan tâm */}
        <div className="relative w-full">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 z-10 relative">
            <h3 className="text-[15px] font-bold text-gray-900 uppercase mb-6 border-b border-gray-100 pb-3">
              Quý khách có thể quan tâm
            </h3>
            <ul className="flex flex-col gap-8 mt-2">
              <li>
                <Link href="/price_list" className="block group">
                  <p className="text-[15px] text-gray-800 font-medium group-hover:text-[#3b66ff] transition-colors uppercase">
                    Cập nhật bảng giá xe VinFast mới nhất
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">
                    Khuyến mãi & Ưu đãi
                  </p>
                </Link>
              </li>

              <li>
                <Link href="/contact" className="block group">
                  <p className="text-[15px] text-gray-800 font-medium group-hover:text-[#3b66ff] transition-colors uppercase">
                    Liên hệ nhận báo giá & Đăng ký lái thử
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">Hỗ trợ 24/7</p>
                </Link>
              </li>

              <li>
                <Link href="/" className="block group">
                  <p className="text-[15px] text-gray-800 font-medium group-hover:text-[#3b66ff] transition-colors uppercase">
                    Khám phá chi tiết các dòng xe điện VinFast
                  </p>
                  <p className="text-[13px] text-gray-400 mt-1">
                    Hệ sinh thái xe điện
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
