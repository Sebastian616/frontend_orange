import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { ENVIO_GRATIS_DESDE } from '../config/envio';
import './BannerEnvioGratis.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function BannerEnvioGratis() {
  return (
    <section className="banner-envio" aria-label="Promoción de envío gratis">
      <div className="contenedor banner-envio__interior">
        <Truck size={22} strokeWidth={1.8} aria-hidden="true" />
        <p className="banner-envio__texto">
          <strong>Envío gratis</strong> en compras desde <strong>{formatearPrecio(ENVIO_GRATIS_DESDE)}</strong>
        </p>
        <Link to="/tienda" className="banner-envio__enlace">Ver tienda →</Link>
      </div>
    </section>
  );
}