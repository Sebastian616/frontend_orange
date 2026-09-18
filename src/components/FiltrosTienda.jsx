import { Search } from 'lucide-react';
import './FiltrosTienda.css';

const RANGOS_PRECIO = [
  { label: 'Menos de $50.000', precioMin: undefined, precioMax: 50000 },
  { label: '$50.000 - $150.000', precioMin: 50000, precioMax: 150000 },
  { label: 'Más de $150.000', precioMin: 150000, precioMax: undefined },
];

const OPCIONES_ORDEN = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
];

export default function FiltrosTienda({ categorias, filtros, onCambiarFiltro, onLimpiar }) {
  const rangoActivo = RANGOS_PRECIO.findIndex(
    (r) => String(r.precioMin ?? '') === String(filtros.precioMin ?? '') &&
           String(r.precioMax ?? '') === String(filtros.precioMax ?? '')
  );

  return (
    <aside className="filtros-tienda">
      <div className="filtros-tienda__buscador">
        <Search size={16} strokeWidth={1.8} />
        <input
          type="search"
          placeholder="Buscar producto..."
          value={filtros.q || ''}
          onChange={(e) => onCambiarFiltro({ q: e.target.value, page: 1 })}
        />
      </div>

      <div className="filtros-tienda__grupo">
        <h3>Orden</h3>
        <select
          value={filtros.orden || 'recientes'}
          onChange={(e) => onCambiarFiltro({ orden: e.target.value, page: 1 })}
        >
          {OPCIONES_ORDEN.map((op) => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      <div className="filtros-tienda__grupo">
        <h3>Categorías</h3>
        <ul className="filtros-tienda__lista">
          <li>
            <label>
              <input
                type="radio"
                name="categoria"
                checked={!filtros.categoria}
                onChange={() => onCambiarFiltro({ categoria: undefined, page: 1 })}
              />
              Todas
            </label>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <label>
                <input
                  type="radio"
                  name="categoria"
                  checked={filtros.categoria === cat.id}
                  onChange={() => onCambiarFiltro({ categoria: cat.id, page: 1 })}
                />
                {cat.nombre}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filtros-tienda__grupo">
        <h3>Precio</h3>
        <ul className="filtros-tienda__lista">
          {RANGOS_PRECIO.map((rango, i) => (
            <li key={rango.label}>
              <label>
                <input
                  type="checkbox"
                  checked={rangoActivo === i}
                  onChange={() =>
                    onCambiarFiltro(
                      rangoActivo === i
                        ? { precioMin: undefined, precioMax: undefined, page: 1 }
                        : { precioMin: rango.precioMin, precioMax: rango.precioMax, page: 1 }
                    )
                  }
                />
                {rango.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button className="filtros-tienda__limpiar" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </aside>
  );
}