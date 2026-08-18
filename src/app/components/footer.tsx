"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";

interface GlobalSetting {
  hotline: string;
  showroom: string;
  address: string;
  email: string;
  disclaimer?: string;
}
interface FooterProps {
  settings?: any;
}
const Footer: React.FC<FooterProps> = ({ settings }) => {
  if (!settings) {
    return <div className="w-full h-64 bg-gray-100 animate-pulse"></div>;
  }

  return (
    <div className="w-full mt-auto">
      {/* Khuyến Mãi & Ưu Đãi*/}
      <div className="bg-[#e2e2e2] py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-[22px] font-bold text-gray-800 mb-3 uppercase">
              Khuyến mãi & Ưu đãi
            </h2>
            <p className="text-gray-700 text-[15px] mb-1">
              Quà tặng dành cho khách hàng gửi yêu cầu báo giá Online.
            </p>
            <p className="text-gray-600 italic text-[14px]">
              *Quý khách vui lòng liên hệ hotline tư vấn, nhận thông tin khuyến
              mãi và ưu đãi.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href={`tel:${settings.hotline}`}
              className="bg-[#3b66ff] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded flex items-center transition-colors"
            >
              Hotline: {settings.hotline}
            </a>
          </div>
        </div>
      </div>

      {/* Footer Chính*/}
      <footer className="bg-black text-white pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-gray-800 pb-10 w-full">
            {/* Cột 1: Thông tin Showroom*/}
            <div className="flex flex-col w-full md:items-start md:text-left">
              <h3 className="text-[17px] font-bold mb-5 uppercase tracking-wide">
                {settings.showroom}
              </h3>
              {settings.showroom && (
                <p className="mb-2 text-[15px]">
                  Showroom: {settings.showroom}
                </p>
              )}
              {settings.address && (
                <p className="text-gray-400 text-[14px] leading-relaxed">
                  Địa Chỉ: {settings.address}
                </p>
              )}
            </div>

            {/* Cột 2: Hỗ trợ khách hàng*/}
            <div className="flex flex-col w-full md:items-center">
              <h3 className="text-[17px] font-bold mb-5 uppercase tracking-wide text-center w-full">
                Hỗ Trợ Khách Hàng
              </h3>
              <div className="text-left w-full md:w-auto">
                {settings.hotline && (
                  <p className="mb-2 text-[15px]">
                    Hotline: {settings.hotline}
                  </p>
                )}
                {settings.email && (
                  <p className="text-[15px]">Email: {settings.email}</p>
                )}
              </div>
            </div>

            {/* Cột 3: Follow*/}
            <div className="flex flex-col w-full md:items-end md:text-right">
              <h3 className="text-[17px] font-bold mb-5 uppercase tracking-wide">
                Follow
              </h3>
              <div className="flex space-x-3 justify-start md:justify-end">
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="p-2 border border-gray-400 rounded-full text-gray-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {settings.hotline && (
                  <a
                    href={`tel:${settings.hotline}`}
                    className="p-2 border border-gray-400 rounded-full text-gray-300 hover:border-white hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Phần Links và Copyright */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center md:items-start text-gray-400 text-[13px]">
            <div className="flex flex-col w-full md:w-auto">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <a
                  href="#"
                  className="hover:text-white uppercase transition-colors"
                >
                  Trang chủ
                </a>
                <a
                  href="/price_list"
                  className="hover:text-white uppercase transition-colors"
                >
                  Bảng giá xe
                </a>
                <a
                  href="/privacy_policy"
                  className="hover:text-white uppercase transition-colors"
                >
                  Chính sách bảo mật
                </a>
                <a
                  href="/contact"
                  className="hover:text-white uppercase transition-colors"
                >
                  Liên hệ
                </a>
              </div>
              {settings.disclaimer && (
                <p className="text-center md:text-left mb-2 text-[13px] text-gray-400 whitespace-pre-line leading-relaxed">
                  {settings.disclaimer}
                </p>
              )}
              <p className="text-center md:text-left mt-2">
                Copyright 2026 © vinfast68trinhvanbo.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
