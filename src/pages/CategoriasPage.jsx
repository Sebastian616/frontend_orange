import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ShoppingBag, Layers, Wind, PackageSearch } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { obtenerCategoriasConImagen } from '../api/categorias';
import './CategoriasPage.css';

// Ícono de respaldo para categorías que todavía no tienen ningún producto con foto
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
    obtenerCategoriasConImagen()
      .then(setCategorias)
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
                <div className="categorias-page__imagen" aria-hidden="true">
                  {cat.imagen ? (
                    <img src={cat.imagen} alt="" loading="lazy" />
                  ) : (
                    <Icono size={40} strokeWidth={1.5} />
                  )}
                </div>
                <div className="categorias-page__info">
                  <h2>{cat.nombre}</h2>
                  {cat.totalProductos !== null && (
                    <p className="categorias-page__conteo">
                      {cat.totalProductos} {cat.totalProductos === 1 ? 'producto' : 'productos'}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}