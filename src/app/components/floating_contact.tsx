"use client";

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";

interface FloatingContactProps {
  settings?: any;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ settings }) => {
  const hotline = settings?.hotline || "0333679471";
  const formattedHotline = hotline.replace(/[\s\.]/g, "");

  return (
    <div className="fixed bottom-8 left-6 z-50 flex flex-col gap-4">
      {/* Nút Zalo */}
      <div className="relative group flex items-center">
        <a
          href={`https://zalo.me/${formattedHotline}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#2152ff] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-110 cursor-pointer"
        >
          <img
            src="/Zalo.png"
            alt="Zalo"
            className="w-full h-full object-cover"
          />
        </a>

        {/* Tooltip hiện chữ khi Hover */}
        <span className="absolute left-16 bg-gray-900/90 text-white text-sm font-medium px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
          Nhận báo giá qua Zalo
        </span>
      </div>

      {/* Nút Gọi Điện thoại */}
      <div className="relative group flex items-center">
        {/* Vòng tròn hiệu ứng sóng toả ra (ping) */}
        <div className="absolute inset-0 bg-[#2152ff] rounded-full animate-ping opacity-60"></div>

        <a
          href={`tel:${formattedHotline}`}
          className="relative w-14 h-14 bg-[#2152ff] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-110 cursor-pointer"
        >
          <Phone className="w-6 h-6 animate-pulse" fill="currentColor" />
        </a>

        {/* Tooltip hiện số điện thoại từ API khi Hover */}
        <span className="absolute left-16 bg-gray-900/90 text-white text-[15px] font-bold tracking-wider px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
          {hotline}
        </span>
      </div>
    </div>
  );
};

export default FloatingContact;
