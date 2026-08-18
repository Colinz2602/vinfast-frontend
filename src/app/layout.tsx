import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingContact from "./components/floating_contact";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getGlobalData() {
  try {
    const [settingsRes, navCarsRes] = await Promise.all([
      fetch(`${API_URL}/api/global-setting?populate=*`, {
        next: { revalidate: 60 },
      }),
      fetch(
        `${API_URL}/api/cars?fields[0]=name&fields[1]=slug&populate[car_type][fields][0]=name&populate[car_type][fields][1]=order`,
        { next: { revalidate: 60 } },
      ),
    ]);
    const settingsData = await settingsRes.json();
    const navCarsData = await navCarsRes.json();
    return { settings: settingsData?.data, navCars: navCarsData?.data };
  } catch (error) {
    console.error("Lỗi getGlobalData:", error);
    return { settings: null, navCars: [] };
  }
}

export const metadata: Metadata = {
  title: "VinFast 68 Trịnh Văn Bô | Showroom Ô Tô Chính Hãng Hà Nội",
  description:
    "Vinfast Thăng Long. Địa chỉ: 68 Phố Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội; Phone: 0333679471.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "VinFast 68 Trịnh Văn Bô | Showroom Ô Tô Chính Hãng Hà Nội",
    description:
      "Vinfast Thăng Long. Địa chỉ: 68 Phố Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội.",
    url: "https://vinfast68trinhvanbo.com",
    siteName: "VinFast Ô Tô",
    locale: "vi_VN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch data ngay trên Server
  const { settings, navCars } = await getGlobalData();

  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Truyền data qua props, Navbar/Footer không cần gọi API nữa */}
        <Navbar initialCars={navCars} />
        {children}
        <Footer settings={settings} />
        <FloatingContact settings={settings} />
      </body>
    </html>
  );
}
