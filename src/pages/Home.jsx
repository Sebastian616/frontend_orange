import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FranjaBeneficios from '../components/FranjaBeneficios';
import Categorias from '../components/Categorias';
import ProductosDestacados from '../components/ProductosDestacados';
import BannerPromo from '../components/BannerPromo';
import Footer from '../components/Footer';

export default function Home() {
  useEffect(() => {
    Swal.fire({
      title: '¡10% de descuento!',
      text: 'Registrate y obtené 10% OFF en tu primera compra.',
      icon: 'info',
      timer: 8000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      confirmButtonColor: '#5c3d2e',
    });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FranjaBeneficios />
        <Categorias />
        <ProductosDestacados />
        <BannerPromo />
        <Footer />
      </main>
    </>
  );
}