import { NextResponse } from "next/server";

// Giới hạn độ dài để tránh lạm dụng / payload quá lớn
const MAX_NAME = 100;
const MAX_PHONE = 20;
const MAX_CAR = 100;
const MAX_PAYMENT = 50;

// Rate limit đơn giản theo IP (in-memory, reset khi restart)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
};

const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
};

const asString = (value: unknown, maxLen: number): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
};

// Số điện thoại VN: chỉ chữ số, khoảng trắng, +, -, () và độ dài hợp lý
const isValidPhone = (phone: string): boolean =>
  /^[0-9+()\-\s]{8,20}$/.test(phone);

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    const { name, phone, selectedCar, paymentMethod } = body as Record<
      string,
      unknown
    >;

    const safeName = asString(name, MAX_NAME);
    const safePhone = asString(phone, MAX_PHONE);
    const safeCar = asString(selectedCar, MAX_CAR);
    const safePayment = asString(paymentMethod, MAX_PAYMENT);

    if (!safePhone || !isValidPhone(safePhone)) {
      return NextResponse.json(
        { success: false, error: "Số điện thoại không hợp lệ." },
        { status: 400 },
      );
    }

    const ZALO_TOKEN = process.env.ZALO_BOT_TOKEN;
    const ZALO_CHAT_ID = process.env.ZALO_CHAT_ID;

    if (!ZALO_TOKEN || !ZALO_CHAT_ID) {
      console.error("Thiếu cấu hình ZALO_BOT_TOKEN / ZALO_CHAT_ID");
      return NextResponse.json(
        { success: false, error: "Internal Server Error" },
        { status: 500 },
      );
    }

    // Định dạng lại tin nhắn
    const message = `🔔 CÓ YÊU CẦU BÁO GIÁ:\n- Khách hàng: ${safeName || "Chưa nhập tên"}\n- Số điện thoại: ${safePhone}\n- Xe quan tâm: ${safeCar || "Chưa chọn"}\n- Hình thức: ${safePayment || "Chưa chọn"}`;

    const ZALO_API_URL = `https://bot-api.zaloplatforms.com/bot${ZALO_TOKEN}/sendMessage`;

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
      // Ghi log chi tiết ở server nhưng không trả chi tiết upstream cho client
      console.error("Zalo API Error:", data);
      return NextResponse.json(
        { success: false, error: "Không thể gửi yêu cầu, vui lòng thử lại." },
        { status: 502 },
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
