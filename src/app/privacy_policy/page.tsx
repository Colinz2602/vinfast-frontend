"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

interface GlobalSetting {
  showroom: string;
  address: string;
  hotline: string;
}

export default function PrivacyPolicyPage() {
  const [settings, setSettings] = useState<GlobalSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/global-setting`);
        const data = await res.json();
        const attrs = data?.data || {};

        setSettings({
          showroom: attrs.showroom || "Đang cập nhật...",
          address: attrs.address || "Đang cập nhật...",
          hotline: attrs.hotline || "Đang cập nhật...",
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu global-setting:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalSettings();
  }, []);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-gray-800">
        <h1 className="text-[28px] md:text-[32px] font-bold mb-6 text-[#2152ff]">
          Chính sách bảo mật về quyền riêng tư
        </h1>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <p>
            Chính sách bảo mật về quyền riêng tư này quy định việc sử dụng và
            bảo vệ thông tin bạn cung cấp. Chúng tôi tôn trọng quyền riêng tư và
            luôn nỗ lực bảo vệ thông tin cá nhân của bạn. Chính sách này giải
            thích cách chúng tôi thu thập, chuyển đổi, xử lý, sử dụng và công bố
            các dữ liệu, đồng thời giải thích về các biện pháp bảo mật của chúng
            tôi.
          </p>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              1. Đồng ý và Chấp nhận
            </h2>
            <p>
              Bằng việc cung cấp thông tin cá nhân, bạn đã đồng ý và chấp nhận
              việc trao đổi, xử lý, sử dụng và công bố thông tin như được mô tả
              trong chính sách này.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              2. Thông tin thu thập
            </h2>
            <p className="mb-2">
              Chúng tôi thu thập các thông tin cá nhân bạn cung cấp khi bạn đồng
              ý với yêu cầu của chúng tôi. Thông tin này có thể bao gồm:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Họ và tên</li>
              <li>Địa chỉ</li>
              <li>Số điện thoại</li>
              <li>Địa chỉ email</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              3. Sử dụng thông tin cá nhân
            </h2>
            <p className="mb-2">
              Bằng việc cung cấp thông tin cá nhân, bạn đồng ý với việc chúng
              tôi sử dụng thông tin đó để thực hiện các công việc sau:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trả lời các yêu cầu của bạn</li>
              <li>Cải thiện dịch vụ của chúng tôi</li>
              <li>Cung cấp thông tin, tin tức cập nhật mới về sản phẩm</li>
              <li>Đánh giá các hồ sơ ứng tuyển công việc</li>
              <li>Quản trị và đảm bảo chất lượng sản phẩm của chúng tôi</li>
              <li>Các mục đích khác được liệt kê chi tiết trên website</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              4. Thông tin sử dụng website
            </h2>
            <p>
              Chúng tôi thu thập thông tin về trình duyệt, hệ điều hành, địa chỉ
              IP, vị trí, nhà cung cấp dịch vụ di động, và hệ điều hành di động
              để hiểu thêm về hành vi truy cập web của người dùng nhằm cải thiện
              chất lượng dịch vụ. Chúng tôi không chia sẻ thông tin này với bên
              thứ ba trừ khi được mô tả rõ ràng trong chính sách này.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              5. Bảo mật thông tin
            </h2>
            <p>
              Chúng tôi áp dụng các biện pháp bảo mật hợp pháp để bảo vệ thông
              tin cá nhân của bạn. Dù chúng tôi luôn cố gắng hết sức để bảo mật
              thông tin cá nhân của bạn, việc truyền tải thông tin qua Internet
              hoặc mạng di động không phải lúc nào cũng an toàn tuyệt đối. Bạn
              tự chịu rủi ro về thông tin được tải lên.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              6. Chia sẻ thông tin với bên thứ ba
            </h2>
            <p>
              Chúng tôi không bán hoặc cho thuê thông tin cá nhân của bạn cho
              bên thứ ba trừ khi được mô tả rõ ràng trong chính sách này. Chúng
              tôi chỉ chia sẻ thông tin cá nhân của bạn với các đơn vị liên kết,
              các bên ký hợp đồng và đại lý có tham gia trong việc cung cấp các
              hoạt động bạn đồng ý sử dụng.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              7. Khai báo thông tin cá nhân
            </h2>
            <p>
              Chúng tôi có thể khai báo thông tin cá nhân của bạn để báo cáo cho
              các cơ quan chính quyền, các tổ chức pháp quyền được quy định bởi
              tòa án và theo luật hiện hành.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              8. Sử dụng địa chỉ IP
            </h2>
            <p>
              Chúng tôi có thể thu thập địa chỉ IP của bạn cho các mục đích quản
              trị hệ thống hoặc kiểm tra phương thức sử dụng website. Chúng tôi
              không sử dụng địa chỉ IP cho mục đích khác mà không có sự đồng ý
              của bạn.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              9. Cookies
            </h2>
            <p>
              Website của chúng tôi có thể sử dụng công nghệ "cookies" để ghi
              nhớ thông tin hoạt động của bạn. Bạn có thể chọn đồng ý hoặc từ
              chối cookies thông qua cài đặt trình duyệt.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              10. Thay đổi chính sách
            </h2>
            <p>
              Chính sách này có thể được cập nhật định kỳ. Chúng tôi sẽ đăng
              thông báo về các thay đổi quan trọng trên trang web. Việc bạn tiếp
              tục sử dụng website đồng nghĩa với việc chấp thuận các thay đổi
              trong chính sách này.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-bold mb-2 text-gray-900">
              11. Liên hệ
            </h2>
            <p className="mb-4">
              Nếu bạn có bất kỳ câu hỏi, bình luận hoặc yêu cầu nào liên quan
              đến Chính sách Quyền Riêng tư, vui lòng liên hệ với chúng tôi qua
              thông tin dưới đây:
            </p>

            {/* Dữ liệu liên hệ động từ global_settings API */}
            {isLoading ? (
              <div className="animate-pulse bg-gray-100 h-24 w-full rounded-md mt-4"></div>
            ) : (
              <div className="bg-gray-50 p-4 border-l-4 border-[#2152ff] rounded-r-md mt-4">
                <p className="font-bold text-[16px] text-gray-900 uppercase">
                  {settings?.showroom}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Địa Chỉ:</span>{" "}
                  {settings?.address}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Điện Thoại:</span>{" "}
                  {settings?.hotline}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
