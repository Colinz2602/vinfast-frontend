"use client";

import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";

interface GlobalSetting {
  hotline: string;
  showroom: string;
  address: string;
  email: string;
  bgImageUrl?: string;
}

export default function ContactPage() {
  const [settings, setSettings] = useState<GlobalSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/global-setting?populate=*`);
        const data = await res.json();

        const attrs = data?.data || {};

        let bgImageUrl = "";
        if (attrs.image?.url) {
          bgImageUrl = attrs.image.url.startsWith("http")
            ? attrs.image.url
            : `${API_URL}${attrs.image.url}`;
        }

        setSettings({
          hotline: attrs.hotline,
          showroom: attrs.showroom,
          address: attrs.address,
          email: attrs.email,
          bgImageUrl: bgImageUrl,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu global-setting:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalSettings();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <div className="grow flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-gray-500 font-medium">
            Đang tải thông tin liên hệ...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero Section Liên Hệ */}
      <div className="grow w-full relative bg-black flex items-center min-h-125 md:min-h-150">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-transparent z-10"></div>

          <img
            src={settings?.bgImageUrl}
            alt="Showroom Background"
            className="w-full h-full object-cover "
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-20">
          <div className="max-w-2xl text-white">
            <h3 className="text-[14px] md:text-[15px] font-bold uppercase tracking-wider mb-2 text-gray-300">
              SHOWROOM
            </h3>

            <h1 className="text-3xl md:text-5xl lg:text-[54px] font-bold uppercase mb-4 leading-tight tracking-wide">
              {settings?.showroom}
            </h1>

            <p className="text-[15px] md:text-[16px] text-gray-200 mb-8 leading-relaxed">
              Địa Chỉ: {settings?.address}
            </p>

            {settings?.hotline && (
              <a
                href={`tel:${settings.hotline}`}
                className="inline-flex items-center gap-2 bg-[#3b66ff] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5 fill-current" />
                <span className="text-[16px] tracking-wide">
                  {settings.hotline}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
