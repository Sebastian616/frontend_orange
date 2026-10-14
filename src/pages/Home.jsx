import { useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FranjaBeneficios from '../components/FranjaBeneficios';
import Categorias from '../components/Categorias';
import ProductosDestacados from '../components/ProductosDestacados';
import BannerPromo from '../components/BannerPromo';
import Footer from '../components/Footer';

// Reemplaza por la importación de tu archivo
import bannerPromoImage from '../assets/banner-descuento.jpg'; 

export default function Home() {
  useEffect(() => {
    Swal.fire({
      html: `
        <img 
          src="${bannerPromoImage}" 
          alt="Promoción Especial" 
          style="
            width: 100%; 
            max-width: 500px; 
            height: auto; 
            display: block; 
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          "
        />
      `,
      showConfirmButton: false,
      showCloseButton: true,
      allowOutsideClick: true,
      
      // TEMPORIZADOR DE 8 SEGUNDOS
      timer: 8000,
      timerProgressBar: true, // Muestra una barra animada del tiempo restante (puedes poner false si no la quieres)
      
      // CONFIGURACIÓN DE TRANSPARENCIA Y SIN BORDES
      width: 'auto',
      padding: 0,
      background: 'transparent',
      customClass: {
        popup: 'swal-sin-bordes',
        htmlContainer: 'p-0 m-0'
      },
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        if (container) {
          container.style.margin = '0';
          container.style.padding = '0';
        }
      }
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