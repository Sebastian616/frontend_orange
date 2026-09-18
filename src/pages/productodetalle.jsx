import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ImageOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import { obtenerProductoPorId } from '../api/productos';
import { obtenerResenas, obtenerResumenResenas } from '../api/resenas';
import { alertaAviso, toastExito } from '../utils/alertas';
import { useFavoritos } from '../context/favoritosContext';
import { useCart } from '../context/CartContext';
import './ProductoDetalle.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function ProductoDetalle() {
  const { id } = useParams();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [fotoActiva, setFotoActiva] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const [resenas, setResenas] = useState([]);
  const [resumen, setResumen] = useState({ total_resenas: 0, promedio: 0 });

  useEffect(() => {
    setCargando(true);
    setError(null);
    setFotoActiva(0);
    setTallaSeleccionada(null);
    setCantidad(1);

    obtenerProductoPorId(id)
      .then((data) => setProducto(data))
      .catch(() => setError('No pudimos encontrar este producto.'))
      .finally(() => setCargando(false));

    obtenerResenas(id).then(setResenas).catch(() => setResenas([]));
    obtenerResumenResenas(id).then(setResumen).catch(() => {});
  }, [id]);

  const tallaActual = producto?.tallas?.find((t) => t.talla_id === tallaSeleccionada);
  const stockDisponible = tallaActual?.stock ?? 0;

  function manejarAgregarAlCarrito() {
    if (!tallaSeleccionada) {
      alertaAviso('Selecciona una talla primero');
      return;
    }
    agregarAlCarrito(producto, tallaActual, cantidad);
    toastExito('Agregado al carrito');
  }

  if (cargando) {
    return (
      <>
        <Navbar />
        <main className="contenedor producto-detalle__estado">Cargando producto...</main>
      </>
    );
  }

  if (error || !producto) {
    return (
      <>
        <Navbar />
        <main className="contenedor producto-detalle__estado">
          <p>{error || 'Producto no encontrado.'}</p>
          <Link to="/tienda" className="boton-primario">Volver a la tienda</Link>
        </main>
      </>
    );
  }

  const marcado = esFavorito(producto.id);
  const fotos = producto.fotos?.length ? producto.fotos : [];

  return (
    <>
      <Navbar />
      <main className="contenedor producto-detalle">
        <div className="producto-detalle__galeria">
          <div className="producto-detalle__foto-principal">
            {fotos.length > 0 ? (
              <img src={fotos[fotoActiva]} alt={producto.nombre} />
            ) : (
              <div className="producto-detalle__foto-vacia" aria-hidden="true">
                <ImageOff size={48} strokeWidth={1.3} />
              </div>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="producto-detalle__miniaturas">
              {fotos.map((foto, i) => (
                <button
                  key={foto}
                  className={i === fotoActiva ? 'producto-detalle__miniatura--activa' : ''}
                  onClick={() => setFotoActiva(i)}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img src={foto} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="producto-detalle__info">
          {producto.etiqueta && <span className="producto-detalle__etiqueta">{producto.etiqueta}</span>}
          <h1>{producto.nombre}</h1>

          {resumen.total_resenas > 0 && (
            <div className="producto-detalle__rating">
              <Star size={16} fill="currentColor" strokeWidth={0} />
              <span>{resumen.promedio}</span>
              <span className="producto-detalle__rating-total">({resumen.total_resenas} reseñas)</span>
            </div>
          )}

          <p className="producto-detalle__precio">{formatearPrecio(producto.precio)}</p>
          <p className="producto-detalle__descripcion">{producto.descripcion}</p>

          <div className="producto-detalle__grupo">
            <h3>Talla</h3>
            <div className="producto-detalle__tallas">
              {producto.tallas?.map((t) => (
                <button
                  key={t.talla_id}
                  className={t.talla_id === tallaSeleccionada ? 'producto-detalle__talla--activa' : ''}
                  disabled={t.stock === 0}
                  onClick={() => { setTallaSeleccionada(t.talla_id); setCantidad(1); }}
                >
                  {t.talla}
                  {t.stock === 0 && <span className="producto-detalle__agotada">Agotada</span>}
                </button>
              ))}
              {(!producto.tallas || producto.tallas.length === 0) && (
                <p className="producto-detalle__sin-tallas">Sin tallas disponibles por ahora.</p>
              )}
            </div>
          </div>

          {tallaSeleccionada && (
            <div className="producto-detalle__grupo">
              <h3>Cantidad</h3>
              <div className="producto-detalle__cantidad">
                <button onClick={() => setCantidad((c) => Math.max(1, c - 1))} disabled={cantidad <= 1}>−</button>
                <span>{cantidad}</span>
                <button onClick={() => setCantidad((c) => Math.min(stockDisponible, c + 1))} disabled={cantidad >= stockDisponible}>+</button>
              </div>
              <p className="producto-detalle__stock">{stockDisponible} disponibles en esta talla</p>
            </div>
          )}

          <div className="producto-detalle__acciones">
            <button className="boton-primario producto-detalle__boton-carrito" onClick={manejarAgregarAlCarrito}>
              <ShoppingCart size={18} strokeWidth={1.8} />
              Agregar al carrito
            </button>
            <button
              className={`producto-detalle__boton-favorito ${marcado ? 'producto-detalle__boton-favorito--activo' : ''}`}
              onClick={() => toggleFavorito(producto)}
              aria-pressed={marcado}
              aria-label={marcado ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart size={20} strokeWidth={1.8} fill={marcado ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <section className="producto-detalle__resenas">
          <h2>Reseñas {resumen.total_resenas > 0 && `(${resumen.total_resenas})`}</h2>

          {resenas.length === 0 && (
            <p className="producto-detalle__estado-resenas">Este producto todavía no tiene reseñas.</p>
          )}

          <ul className="producto-detalle__lista-resenas">
            {resenas.map((r) => (
              <li key={r.id}>
                <div className="producto-detalle__resena-cabecera">
                  <strong>{r.usuario_nombre}</strong>
                  <span className="producto-detalle__resena-estrellas">
                    {'★'.repeat(r.calificacion)}{'☆'.repeat(5 - r.calificacion)}
                  </span>
                </div>
                {r.comentario && <p>{r.comentario}</p>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}