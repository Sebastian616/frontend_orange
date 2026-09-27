import { Link, useNavigate } from 'react-router-dom';
import { ImageOff, Heart, ShoppingCart, EyeOff } from 'lucide-react';
import { useFavoritos } from '../context/FavoritosContext';
import { useCart } from '../context/CartContext';
import { toastExito } from '../utils/alertas';
import './TarjetaProducto.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function TarjetaProducto({ producto }) {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();

  const foto = producto.fotos?.[0];
  const marcado = esFavorito(producto.id);

  // producto.activo puede venir en false cuando el producto viene de
  // /favoritos (esa lista no filtra por activo, a diferencia de /productos).
  // Un producto desactivado no se puede comprar aunque siga en favoritos.
  const noDisponible = producto.activo === false;

  const tallasConStock = producto.tallas?.filter((t) => t.stock > 0) || [];
  const agotado = !noDisponible && producto.tallas?.length > 0 && tallasConStock.length === 0;

  function manejarAgregarAlCarrito() {
    if (tallasConStock.length === 1) {
      // Solo hay una talla disponible: se agrega directo, sin fricción
      agregarAlCarrito(producto, tallasConStock[0], 1);
      toastExito('Agregado al carrito');
    } else {
      // Varias tallas (o ninguna cargada todavía): que elija en el detalle
      navigate(`/productos/${producto.id}`);
    }
  }

  return (
    <article className={`tarjeta-producto ${noDisponible ? 'tarjeta-producto--no-disponible' : ''}`}>
      <Link to={`/productos/${producto.id}`} className="tarjeta-producto__imagen-wrap">
        {foto ? (
          <img src={foto} alt={producto.nombre} className="tarjeta-producto__imagen" />
        ) : (
          <div className="tarjeta-producto__imagen tarjeta-producto__imagen--vacia" aria-hidden="true">
            <ImageOff size={28} strokeWidth={1.5} />
          </div>
        )}

        {noDisponible && (
          <span className="tarjeta-producto__etiqueta-no-disponible">
            <EyeOff size={13} strokeWidth={2} />
            No disponible
          </span>
        )}
      </Link>

      <button
        className={`tarjeta-producto__favorito ${marcado ? 'tarjeta-producto__favorito--activo' : ''}`}
        aria-label={marcado ? `Quitar ${producto.nombre} de favoritos` : `Agregar ${producto.nombre} a favoritos`}
        aria-pressed={marcado}
        onClick={() => toggleFavorito(producto)}
      >
        <Heart size={16} strokeWidth={1.8} fill={marcado ? 'currentColor' : 'none'} />
      </button>

      <div className="tarjeta-producto__info">
        <Link to={`/productos/${producto.id}`} className="tarjeta-producto__nombre-link">
          <h3 className="tarjeta-producto__nombre">{producto.nombre}</h3>
        </Link>
        <p className="tarjeta-producto__precio">{formatearPrecio(producto.precio)}</p>

        <button
          className="boton-secundario tarjeta-producto__boton"
          onClick={manejarAgregarAlCarrito}
          disabled={agotado || noDisponible}
        >
          <ShoppingCart size={16} strokeWidth={1.8} />
          {noDisponible ? 'No disponible' : agotado ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}