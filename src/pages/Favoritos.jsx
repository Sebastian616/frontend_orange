import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import TarjetaProducto from '../components/TarjetaProducto';
import { useAuth } from '../context/AuthContext';
import { useFavoritos } from '../context/FavoritosContext';
import './Favoritos.css';

export default function Favoritos() {
  const { estaAutenticado } = useAuth();
  const { productosFavoritos, cargandoFavoritos } = useFavoritos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/favoritos' } });
    }
  }, [estaAutenticado, navigate]);

  if (!estaAutenticado) return null;

  return (
    <>
      <Navbar />
      <main className="contenedor favoritos-page">
        <h1>Mis favoritos</h1>

        {cargandoFavoritos && <p className="favoritos-page__estado">Cargando tus favoritos...</p>}

        {!cargandoFavoritos && productosFavoritos.length === 0 && (
          <div className="favoritos-page__vacio">
            <Heart size={40} strokeWidth={1.3} />
            <p>Todavía no has marcado ningún producto como favorito.</p>
            <Link to="/tienda" className="boton-primario">Ir a la tienda</Link>
          </div>
        )}

        {!cargandoFavoritos && productosFavoritos.length > 0 && (
          <div className="favoritos-page__grid">
            {productosFavoritos.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}