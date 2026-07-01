import React from "react";
import { Car, BadgeDollarSign, Gift, Check } from "lucide-react";

const Navbutton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a
          href="#"
          className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Car size={20} />Ô TÔ VINFAST
        </a>
        <a
          href="#"
          className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Check className="w-5 h-5" />
          LÁI THỬ XE
        </a>

        <a
          href="#"
          className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <BadgeDollarSign className="w-5 h-5" />
          BẢNG GIÁ XE
        </a>

        <a
          href="#"
          className="bg-[#3b66ff] hover:bg-blue-700 text-white py-3 px-4 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Gift className="w-5 h-5" />
          KHUYẾN MÃI
        </a>
      </div>
    </div>
  );
};

export default Navbutton;
