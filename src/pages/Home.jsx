import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FranjaBeneficios from '../components/FranjaBeneficios';
import Categorias from '../components/Categorias';
import ProductosDestacados from '../components/ProductosDestacados';
import BannerPromo from '../components/BannerPromo';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FranjaBeneficios />
        <Categorias />
        <ProductosDestacados />
        <BannerPromo />
      </main>
    </>
  );
}