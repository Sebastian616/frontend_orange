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
        <a href="/tienda" className="boton-primario hero__cta">
          Explorar tienda
        </a>
      </div>
      <div className="hero__imagen" role="img" aria-label="Mujer usando ropa deportiva de la colección Orange" />
    </section>
  );
}
