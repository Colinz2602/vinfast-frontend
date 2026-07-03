import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, selectedCar, paymentMethod } = body;

    // Định dạng lại tin nhắn
    const message = `🔔 CÓ YÊU CẦU BÁO GIÁ:\n- Khách hàng: ${name || "Chưa nhập tên"}\n- Số điện thoại: ${phone}\n- Xe quan tâm: ${selectedCar || "Chưa chọn"}\n- Hình thức: ${paymentMethod}`;

    // Lấy thông tin từ biến môi trường (File .env)
    const ZALO_TOKEN = process.env.ZALO_BOT_TOKEN;
    const ZALO_CHAT_ID = process.env.ZALO_CHAT_ID;

    const ZALO_API_URL = `https://bot-api.zaloplatforms.com/bot${ZALO_TOKEN}/sendMessage`;

    // Cấu hình payload tuỳ theo tài liệu API của Zalo Bot
    const payload = {
      chat_id: ZALO_CHAT_ID,
      text: message,
    };

    const response = await fetch(ZALO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Zalo API Error:", data);
      return NextResponse.json(
        { success: false, error: data.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi server khi gửi Zalo:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
