"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

function ThankYouContent() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Không cần setTimeout vì sessionStorage.setItem hoạt động đồng bộ
    const isSubmitted = sessionStorage.getItem("form_submitted");

    if (!isSubmitted) {
      // Nếu không có cờ, đẩy về trang chủ
      router.replace("/");
    } else {
      // Nếu có, cho phép hiển thị
      setIsAuthorized(true);
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        Đang xử lý...
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex items-center justify-center bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-xl p-10 text-center border border-gray-100">
        {/* Biểu tượng Checkmark */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-[#2152ff] mb-4 uppercase">
          Cảm ơn bạn!
        </h1>

        <p className="text-gray-600 text-[16px] leading-relaxed mb-8">
          Thông tin của bạn đã được gửi thành công. Chuyên viên tư vấn của chúng
          tôi sẽ liên hệ với bạn qua số điện thoại cung cấp trong thời gian sớm
          nhất để hỗ trợ và báo giá chi tiết.
        </p>

        <Link
          href="/"
          className="inline-flex justify-center items-center bg-[#3b66ff] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-[15px] uppercase shadow-md"
        >
          Quay về Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="bg-white flex flex-col">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Đang xử lý...
          </div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </main>
  );
}
