import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ShoppingBag, Layers, Wind, PackageSearch } from 'lucide-react';
import { obtenerCategoriasConImagen } from '../api/categorias';
import './Categorias.css';

// Ícono de respaldo para categorías que todavía no tienen ningún producto con foto
const ICONO_POR_CATEGORIA = {
  Leggings: Wind,
  Tops: Shirt,
  Conjuntos: Layers,
  Chaquetas: Shirt,
  Accesorios: ShoppingBag,
};

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerCategoriasConImagen()
      .then(setCategorias)
      .catch(() => setCategorias([]))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="categorias contenedor">
      <div className="categorias__encabezado">
        <div>
          <h2>Categorías</h2>
          <p className="categorias__subtitulo">Encuentra lo que necesitas</p>
        </div>
        <Link to="/categorias" className="categorias__ver-todas">Ver todas →</Link>
      </div>

      {cargando && <p className="categorias__estado">Cargando categorías...</p>}
      {!cargando && categorias.length === 0 && (
        <p className="categorias__estado">No hay categorías disponibles por ahora.</p>
      )}

      <div className="categorias__grid">
        {categorias.map((cat) => {
          const Icono = ICONO_POR_CATEGORIA[cat.nombre] || PackageSearch;
          return (
            <Link key={cat.id} to={`/tienda?categoria=${cat.id}`} className="categorias__tarjeta">
              <div className="categorias__imagen" aria-hidden="true">
                {cat.imagen ? (
                  <img src={cat.imagen} alt="" loading="lazy" />
                ) : (
                  <Icono size={32} strokeWidth={1.5} />
                )}
              </div>
              <p>{cat.nombre}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}