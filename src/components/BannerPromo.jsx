import './BannerPromo.css';

export default function BannerPromo() {
  return (
    <section className="banner-promo">
      <div className="contenedor banner-promo__contenido">
        <h2 className="banner-promo__titulo">
          ¿eres vendedor?
          <br />
          para compras al por mayor.
        </h2>
        <a href="https://wa.me/3114163706" target="_blank" className="boton-primario"> Escribenos por whatsapp </a>
      </div>
    </section>
  );
}
