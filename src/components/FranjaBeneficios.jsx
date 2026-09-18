import { Truck, ShieldCheck, Headphones } from 'lucide-react';
import './FranjaBeneficios.css';

const BENEFICIOS = [
  { Icono: Truck, titulo: 'Envíos Rápidos', detalle: 'A todo el país' },
  { Icono: ShieldCheck, titulo: 'Compra segura', detalle: 'Tus datos protegidos' },
  { Icono: Headphones, titulo: 'Soporte 24/7', detalle: 'Estamos para ti' },
];

export default function FranjaBeneficios() {
  return (
    <section className="franja-beneficios">
      <div className="contenedor franja-beneficios__grid">
        {BENEFICIOS.map(({ Icono, titulo, detalle }) => (
          <div key={titulo} className="franja-beneficios__item">
            <span className="franja-beneficios__icono" aria-hidden="true">
              <Icono size={22} strokeWidth={1.6} />
            </span>
            <div>
              <p className="franja-beneficios__titulo">{titulo}</p>
              <p className="franja-beneficios__detalle">{detalle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
