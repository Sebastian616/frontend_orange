import { Link } from 'react-router-dom';
import CarruselHero from './CarruselHero';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__contenido">
        <p className="hero__eyebrow">Nueva colección</p>
        <h1 className="hero__titulo">
          Productos que
          <br />
          conectan contigo.
        </h1>
        <p className="hero__descripcion">
          Ropa y accesorios diseñados para acompañarte en cada momento.
        </p>
        <Link to="/tienda" className="boton-primario hero__cta">
          Explorar tienda
        </Link>
      </div>
      <CarruselHero />
    </section>
  );
}