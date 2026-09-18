import './BannerPromo.css';

export default function BannerPromo() {
  return (
    <section className="banner-promo">
      <div className="contenedor banner-promo__contenido">
        <h2 className="banner-promo__titulo">
          Calidad, estilo y
          <br />
          comodidad en un solo lugar.
        </h2>
        <a href="/tienda" className="boton-primario">Ver colección</a>
      </div>
    </section>
  );
}
