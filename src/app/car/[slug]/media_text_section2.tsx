import React from "react";
import { formatText } from "@/app/lib/format_text";

interface MediaTextSection2Props {
  title?: string;
  data: {
    content_text?: string;
    content_images?: any[];
  } | null;
}

export default function MediaTextSection2({
  title,
  data,
}: MediaTextSection2Props) {
  if (!data) return null;

  const textContent = data.content_text || "";
  const images = data.content_images || [];

  const textBlocks = textContent
    .split(/\n\s*\n/)
    .map((t: string) => t.trim())
    .filter((t: string) => t !== "");

  if (textBlocks.length === 0 && images.length === 0) return null;

  const rawFirstText = textBlocks[0];
  const firstText =
    rawFirstText === "-" || rawFirstText === "_" ? "" : rawFirstText;

  const firstImage = images[0];
  const remainingTexts = textBlocks.slice(1);
  const remainingImages = images.slice(1);

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
      {title && (
        <h2 className="text-4xl font-medium text-gray-900 uppercase mb-4">
          {title}
        </h2>
      )}

      <div className="flex flex-col gap-10">
        {/* Phần tử đầu tiên */}
        <div className="w-full">
          {firstText && (
            <p
              className="text-[17px] text-gray-700 leading-relaxed text-justify mb-6 whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formatText(firstText) }}
            />
          )}
          {firstImage && (
            <img
              src={getMediaUrl(firstImage)}
              alt={`${title} tổng thể`}
              className="w-full h-auto object-cover rounded-sm shadow-sm"
            />
          )}
        </div>

        {/* Các phần tử tiếp theo */}
        {(remainingTexts.length > 0 || remainingImages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
            {Array.from({
              length: Math.max(remainingTexts.length, remainingImages.length),
            }).map((_, idx) => {
              const rawText = remainingTexts[idx];
              const text = rawText === "_" || rawText === "-" ? "" : rawText;

              const img = remainingImages[idx];
              const mediaUrl = getMediaUrl(img);

              return (
                <div key={idx} className="flex flex-col h-full">
                  {mediaUrl && (
                    <img
                      src={mediaUrl}
                      alt={`${title} chi tiết ${idx + 1}`}
                      className="w-full h-auto object-cover rounded-sm shadow-sm mb-4"
                    />
                  )}
                  {text && (
                    <p
                      className="text-[15px] text-gray-700 leading-relaxed text-justify"
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
