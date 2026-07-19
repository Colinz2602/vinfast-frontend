import React from "react";
import { formatText } from "@/app/lib/format_text";

interface MediaTextSection3Props {
  title?: string;
  data: {
    content_text?: string;
    content_images?: any[];
  } | null;
}

export default function MediaTextSection3({
  title,
  data,
}: MediaTextSection3Props) {
  if (!data) return null;

  const textContent = data.content_text || "";
  // Toàn bộ hình ảnh sẽ được đẩy vào phần Grid 2 cột
  const images = data.content_images || [];

  const textBlocks = textContent
    .split(/\n\s*\n/)
    .map((t: string) => t.trim())
    .filter((t: string) => t !== "");

  if (textBlocks.length === 0 && images.length === 0) return null;

  // Lấy đoạn text đầu tiên làm phần giới thiệu không hình
  const rawFirstText = textBlocks[0];
  const firstText =
    rawFirstText === "-" || rawFirstText === "_" ? "" : rawFirstText;

  // Các đoạn text còn lại dành cho phần tử Grid
  const remainingTexts = textBlocks.slice(1);

  const getMediaUrl = (media: any) => {
    let url = media?.url || "";
    const API_URL =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    if (url && !url.startsWith("http")) {
      url = `${API_URL}${url}`;
    }
    return url;
  };

  return (
    <div className="w-full">
      {/* Tiêu đề của khối (nếu có) */}
      {title && (
        <h2 className="text-4xl font-medium text-gray-900 uppercase mb-4">
          {title}
        </h2>
      )}

      <div className="flex flex-col gap-8">
        {/* ĐOẠN 1: CHỈ TEXT, KHÔNG HÌNH ẢNH */}
        {firstText && (
          <div className="w-full">
            <p
              className="text-[17px] text-gray-700 leading-relaxed text-justify whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formatText(firstText) }}
            />
          </div>
        )}

        {/* ĐOẠN 2 TRỞ ĐI: GRID 2 CỘT (HÌNH TRÊN, TEXT DƯỚI) */}
        {(remainingTexts.length > 0 || images.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
            {Array.from({
              length: Math.max(remainingTexts.length, images.length),
            }).map((_, idx) => {
              const rawText = remainingTexts[idx];
              const text = rawText === "_" || rawText === "-" ? "" : rawText;

              const img = images[idx];
              const mediaUrl = getMediaUrl(img);

              return (
                <div key={idx} className="flex flex-col h-full">
                  {/* Hình ảnh hiển thị bên trên */}
                  {mediaUrl && (
                    <img
                      src={mediaUrl}
                      alt={`${title || "Chi tiết"} ${idx + 1}`}
                      className="w-full h-auto object-cover rounded-sm shadow-sm mb-4"
                    />
                  )}
                  {/* Text hiển thị ngay bên dưới hình ảnh */}
                  {text && (
                    <p
                      className="text-[15px] text-gray-700 leading-relaxed text-justify mt-2"
                      dangerouslySetInnerHTML={{ __html: formatText(text) }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
