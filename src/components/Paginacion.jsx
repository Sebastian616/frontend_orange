import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Paginacion.css';

export default function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="paginacion" aria-label="Paginación de productos">
      <button
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {paginas.map((p) => (
        <button
          key={p}
          onClick={() => onCambiarPagina(p)}
          className={p === paginaActual ? 'paginacion__activa' : ''}
          aria-current={p === paginaActual ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}