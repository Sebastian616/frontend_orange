import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FiltrosTienda from '../components/FiltrosTienda';
import TarjetaProducto from '../components/TarjetaProducto';
import Paginacion from '../components/Paginacion';
import { obtenerProductos } from '../api/productos';
import { obtenerCategorias } from '../api/categorias';
import './Tienda.css';

export default function Tienda() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [paginacion, setPaginacion] = useState({ page: 1, totalPaginas: 1, total: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const filtros = {
    categoria: searchParams.get('categoria') || undefined,
    q: searchParams.get('q') || undefined,
    precioMin: searchParams.get('precioMin') || undefined,
    precioMax: searchParams.get('precioMax') || undefined,
    orden: searchParams.get('orden') || 'recientes',
    page: Number(searchParams.get('page')) || 1,
  };

  const actualizarFiltros = useCallback((cambios) => {
    const siguiente = { ...filtros, ...cambios };
    const params = {};
    Object.entries(siguiente).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && !(key === 'orden' && value === 'recientes') && !(key === 'page' && value === 1)) {
        params[key] = value;
      }
    });
    setSearchParams(params);
  }, [searchParams]);

  useEffect(() => {
    obtenerCategorias().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  useEffect(() => {
    setCargando(true);
    setError(null);
    obtenerProductos({ ...filtros, limit: 12 })
      .then((data) => {
        setProductos(data.productos || []);
        setPaginacion(data.paginacion || { page: 1, totalPaginas: 1, total: 0 });
      })
      .catch(() => setError('No pudimos cargar los productos. Intenta de nuevo.'))
      .finally(() => setCargando(false));
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <main className="contenedor tienda">
        <div className="tienda__encabezado">
          <h1>Tienda</h1>
          <p>Descubre nuestra colección</p>
        </div>

        <div className="tienda__layout">
          <FiltrosTienda
            categorias={categorias}
            filtros={filtros}
            onCambiarFiltro={actualizarFiltros}
            onLimpiar={() => setSearchParams({})}
          />

          <div className="tienda__resultados">
            {cargando && <p className="tienda__estado">Cargando productos...</p>}
            {error && <p className="tienda__estado">{error}</p>}
            {!cargando && !error && productos.length === 0 && (
              <p className="tienda__estado">No encontramos productos con esos filtros.</p>
            )}

            {!cargando && !error && productos.length > 0 && (
              <>
                <p className="tienda__conteo">{paginacion.total} productos encontrados</p>
                <div className="tienda__grid">
                  {productos.map((producto) => (
                    <TarjetaProducto key={producto.id} producto={producto} />
                  ))}
                </div>
                <Paginacion
                  paginaActual={paginacion.page}
                  totalPaginas={paginacion.totalPaginas}
                  onCambiarPagina={(page) => actualizarFiltros({ page })}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}