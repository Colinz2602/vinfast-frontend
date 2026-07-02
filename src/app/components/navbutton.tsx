"use client";

import React, { useState } from "react";
import { Car, BadgeDollarSign, Gift, Check } from "lucide-react";
import QuoteModal from "./quote_modal";

const Navbutton: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="#danh-sach-xe"
            className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Car size={20} />Ô TÔ VINFAST
          </a>

          <button
            onClick={() => setIsQuoteOpen(true)}
            className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Check className="w-5 h-5" />
            LÁI THỬ XE
          </button>

          <a
            href="/price_list"
            className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BadgeDollarSign className="w-5 h-5" />
            BẢNG GIÁ XE
          </a>

          <button
            onClick={() => setIsQuoteOpen(true)}
            className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            KHUYẾN MÃI
          </button>
        </div>
      </div>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
};

export default Navbutton;
