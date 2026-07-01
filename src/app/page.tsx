import Navbar from "./components/navbar";
import Navbutton from "./components/navbutton";
import Slider from "./components/slider";
import CarList from "./components/cars_list";
import Footer from "./components/footer";
import Experience from "./components/experience";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <Slider />

      <Navbutton />

      <CarList />

      <Experience />

      <Footer />
    </main>
  );
}
