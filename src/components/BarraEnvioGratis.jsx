import { Truck, CheckCircle2 } from 'lucide-react';
import { ENVIO_GRATIS_DESDE } from '../config/envio';
import './BarraEnvioGratis.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function BarraEnvioGratis({ subtotal }) {
  const faltante = Math.max(0, ENVIO_GRATIS_DESDE - subtotal);
  const completo = faltante === 0;
  const porcentaje = Math.min(100, Math.round((subtotal / ENVIO_GRATIS_DESDE) * 100));

  return (
    <div className={`barra-envio ${completo ? 'barra-envio--completa' : ''}`}>
      <p className="barra-envio__texto" aria-live="polite">
        {completo ? (
          <>
            <CheckCircle2 size={18} strokeWidth={1.8} />
            <span>¡Tu pedido tiene <strong>envío gratis</strong>!</span>
          </>
        ) : (
          <>
            <Truck size={18} strokeWidth={1.8} />
            <span>
              Te faltan <strong>{formatearPrecio(faltante)}</strong> para tener <strong>envío gratis</strong>
            </span>
          </>
        )}
      </p>

      <div
        className="barra-envio__pista"
        role="progressbar"
        aria-label="Progreso hacia el envío gratis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={porcentaje}
      >
        <div className="barra-envio__relleno" style={{ width: `${porcentaje}%` }} />
      </div>

      <p className="barra-envio__nota">Envío gratis en compras desde {formatearPrecio(ENVIO_GRATIS_DESDE)}</p>
    </div>
  );
}