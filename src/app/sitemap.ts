import { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vinfast68trinhvanbo.com";
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let cars: any[] = [];
  try {
    const res = await fetch(
      `${API_URL}/api/cars?fields[0]=slug&fields[1]=updatedAt`,
      {
        next: { revalidate: 3600 },
      },
    );
    const data = await res.json();
    if (data?.data) {
      cars = data.data;
    }
  } catch (error) {
    console.error("Lỗi khi fetch cars cho sitemap:", error);
  }

  // Tạo sitemap cho các trang chi tiết xe (Dynamic Routes)
  const carUrls: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${SITE_URL}/car/${car.slug}`,
    lastModified: car.updatedAt ? new Date(car.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Danh sách các trang tĩnh (Static Routes)
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/price_list`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy_policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...carUrls];
}
