import Navbutton from "./components/navbutton";
import Slider from "./components/slider";
import CarList from "./components/cars_list";
import Experience from "./components/experience";

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

async function getHomeData() {
  const [sliderRes, carsRes, expRes] = await Promise.all([
    fetch(`${API_URL}/api/sliders?populate=*`, {
      next: { revalidate: 60 },
    }),
    // Đưa query về populate=* cơ bản, vì có revalidate: 60 nên không sợ quá tải database nữa
    fetch(`${API_URL}/api/cars?populate=*`, {
      next: { revalidate: 60 },
    }),
    fetch(`${API_URL}/api/experience?populate[experience][populate]=*`, {
      next: { revalidate: 60 },
    }),
  ]);

  return {
    sliders: await sliderRes.json(),
    cars: await carsRes.json(),
    experience: await expRes.json(),
  };
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Slider initialData={data.sliders?.data} />
      <Navbutton />
      <CarList initialData={data.cars?.data} />
      <Experience initialData={data.experience?.data} />
    </main>
  );
}
