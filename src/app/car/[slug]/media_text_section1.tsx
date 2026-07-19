import React from "react";
import { formatText } from "@/app/lib/format_text";

interface MediaTextSectionProps {
  title?: string;
  titleClassName?: string;
  containerClassName?: string;
  data: {
    content_text?: string;
    content_images?: any[];
  } | null;
}

export default function MediaTextSection1({
  title,
  titleClassName = "text-4xl md:text-4xl font-medium text-gray-900 uppercase mb-4",
  containerClassName = "w-full mt-12 mb-12",
  data,
}: MediaTextSectionProps) {
  if (!data) return null;

  const hasText = !!data.content_text;
  const hasImages = data.content_images && data.content_images.length > 0;

  if (!hasText && !hasImages) return null;

  const textBlocks = (data.content_text || "")
    .split(/\n\s*\n/)
    .filter((t: string) => t.trim() !== "");

  const images = data.content_images || [];
  const maxLen = Math.max(textBlocks.length, images.length);

  return (
    <div className={containerClassName}>
      {title && <h2 className={titleClassName}>{title}</h2>}

      <div className="flex flex-col gap-6 text-gray-700 leading-relaxed text-justify mt-2">
        {Array.from({ length: maxLen }).map((_, index) => {
          const text = textBlocks[index];
          const media = images[index];

          let mediaUrl = media?.url || "";
          const API_URL =
            process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
          if (mediaUrl && !mediaUrl.startsWith("http")) {
            mediaUrl = `${API_URL}${mediaUrl}`;
          }
          const mimeType = media?.mime || media?.attributes?.mime || "";
          const isVideo = mimeType.startsWith("video");

          return (
            <React.Fragment key={index}>
              {text && (
                <p
                  className="text-[17px] whitespace-pre-line"
                  // Thay vì in {text} trực tiếp, ta dùng dangerouslySetInnerHTML
                  dangerouslySetInnerHTML={{ __html: formatText(text) }}
                />
              )}
              {mediaUrl &&
                (isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    muted
                    loop
                    playsInline
                    className="w-full h-auto rounded-sm shadow-sm mt-2"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`${title || "Chi tiết"} phần ${index + 1}`}
                    className="w-full h-auto object-cover rounded-sm shadow-sm mt-2"
                  />
                ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
