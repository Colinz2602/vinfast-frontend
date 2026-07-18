import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingContact from "./components/floating_contact";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinfast Thăng Long - Đại Lý Phân Phối Ô Tô Vinfast Hà Nội",
  description:
    "Vinfast Thăng Long. Địa chỉ: 68 Phố Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội; Phone: 0836588679.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Vinfast Thăng Long - Đại Lý Phân Phối Ô Tô Vinfast Hà Nội",
    description:
      "Vinfast Thăng Long. Địa chỉ: 68 Phố Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội.",
    url: "https://vinfast68trinhvanbo.com",
    siteName: "VinFast Ô Tô",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}
