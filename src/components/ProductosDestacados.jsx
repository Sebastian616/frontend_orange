import { useEffect, useState } from 'react';
import { obtenerProductosDestacados } from '../api/productos';
import TarjetaProducto from './TarjetaProducto';
import './ProductosDestacados.css';

export default function ProductosDestacados() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerProductosDestacados(4)
      .then((data) => setProductos(data.productos || []))
      .catch(() => setError('No pudimos cargar los productos destacados.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="productos-destacados contenedor">
      <h2>Productos destacados</h2>

      {cargando && <p className="productos-destacados__estado">Cargando productos...</p>}
      {error && <p className="productos-destacados__estado">{error}</p>}
      {!cargando && !error && productos.length === 0 && (
        <p className="productos-destacados__estado">Todavía no hay productos publicados.</p>
      )}

      <div className="productos-destacados__grid">
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}