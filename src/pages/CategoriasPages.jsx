import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ShoppingBag, Layers, Wind, PackageSearch } from 'lucide-react';
import Navbar from '../components/Navbar';
import { obtenerCategorias } from '../api/categorias';
import { obtenerProductos } from '../api/productos';
import './CategoriasPages.css';

const ICONO_POR_CATEGORIA = {
  Leggings: Wind,
  Tops: Shirt,
  Conjuntos: Layers,
  Chaquetas: Shirt,
  Accesorios: ShoppingBag,
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerCategorias()
      .then(async (cats) => {
        // Trae el conteo real de productos activos por categoría
        const conConteo = await Promise.all(
          cats.map(async (cat) => {
            try {
              const data = await obtenerProductos({ categoria: cat.id, limit: 1 });
              return { ...cat, totalProductos: data.paginacion?.total ?? 0 };
            } catch {
              return { ...cat, totalProductos: null };
            }
          })
        );
        setCategorias(conConteo);
      })
      .catch(() => setCategorias([]))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="contenedor categorias-page">
        <div className="categorias-page__encabezado">
          <h1>Categorías</h1>
          <p>Explora nuestra colección por tipo de prenda</p>
        </div>

        {cargando && <p className="categorias-page__estado">Cargando categorías...</p>}
        {!cargando && categorias.length === 0 && (
          <p className="categorias-page__estado">No hay categorías disponibles por ahora.</p>
        )}

        <div className="categorias-page__grid">
          {categorias.map((cat) => {
            const Icono = ICONO_POR_CATEGORIA[cat.nombre] || PackageSearch;
            return (
              <Link key={cat.id} to={`/tienda?categoria=${cat.id}`} className="categorias-page__tarjeta">
                <div className="categorias-page__icono">
                  <Icono size={32} strokeWidth={1.5} />
                </div>
                <h2>{cat.nombre}</h2>
                {cat.totalProductos !== null && (
                  <p className="categorias-page__conteo">
                    {cat.totalProductos} {cat.totalProductos === 1 ? 'producto' : 'productos'}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}