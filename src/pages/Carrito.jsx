import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../api/pedidos';
import { obtenerDirecciones } from '../api/direcciones';
import { alertaError, alertaAviso } from '../utils/alertas';
import './Carrito.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

const COSTO_ENVIO = 8000;

export default function Carrito() {
  const { items, actualizarCantidad, quitarDelCarrito, vaciarCarrito, subtotal } = useCart();
  const { estaAutenticado, token } = useAuth();
  const navigate = useNavigate();

  const [procesando, setProcesando] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState('');
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);

  const total = items.length > 0 ? subtotal + COSTO_ENVIO : 0;

  useEffect(() => {
    if (!estaAutenticado) {
      setCargandoDirecciones(false);
      return;
    }
    obtenerDirecciones(token)
      .then((data) => {
        setDirecciones(data);
        if (data.length > 0) setDireccionId(data[0].id);
      })
      .catch(() => setDirecciones([]))
      .finally(() => setCargandoDirecciones(false));
  }, [estaAutenticado, token]);

  async function manejarCheckout() {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }

    if (!direccionId) {
      alertaAviso('Selecciona (o agrega) una dirección de envío antes de continuar');
      return;
    }

    setProcesando(true);

    try {
      const pedido = await crearPedido(
        {
          direccionId,
          items: items.map((i) => ({
            productoId: i.productoId,
            tallaId: i.tallaId,
            cantidad: i.cantidad,
          })),
          costoEnvio: COSTO_ENVIO,
        },
        token
      );

      setPedidoConfirmado(pedido);
      vaciarCarrito();
    } catch (err) {
      alertaError(err.message || 'No pudimos procesar tu pedido');
    } finally {
      setProcesando(false);
    }
  }

  if (pedidoConfirmado) {
    return (
      <>
        <Navbar />
        <main className="contenedor carrito__confirmacion">
          <ShoppingBag size={48} strokeWidth={1.3} />
          <h1>¡Pedido confirmado!</h1>
          <p>Tu pedido quedó registrado con estado <strong>{pedidoConfirmado.estado}</strong>.</p>
          <p className="carrito__confirmacion-total">Total: {formatearPrecio(pedidoConfirmado.total)}</p>
          <div className="carrito__confirmacion-acciones">
            <Link to="/pedidos" className="boton-primario">Ver mis pedidos</Link>
            <Link to="/tienda" className="boton-secundario">Seguir comprando</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="contenedor carrito">
        <h1>Tu carrito</h1>

        {items.length === 0 ? (
          <div className="carrito__vacio">
            <p>Tu carrito está vacío.</p>
            <Link to="/tienda" className="boton-primario">Ir a la tienda</Link>
          </div>
        ) : (
          <div className="carrito__layout">
            <ul className="carrito__lista">
              {items.map((item) => (
                <li key={`${item.productoId}-${item.tallaId}`} className="carrito__item">
                  <div className="carrito__item-foto">
                    {item.foto ? <img src={item.foto} alt={item.nombre} /> : <ShoppingBag size={24} />}
                  </div>

                  <div className="carrito__item-info">
                    <p className="carrito__item-nombre">{item.nombre}</p>
                    <p className="carrito__item-talla">Talla: {item.talla}</p>
                    <p className="carrito__item-precio">{formatearPrecio(item.precio)}</p>
                  </div>

                  <div className="carrito__item-cantidad">
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.tallaId, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      −
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.tallaId, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stockMax}
                    >
                      +
                    </button>
                  </div>

                  <p className="carrito__item-subtotal">{formatearPrecio(item.precio * item.cantidad)}</p>

                  <button
                    className="carrito__item-quitar"
                    onClick={() => quitarDelCarrito(item.productoId, item.tallaId)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    <Trash2 size={18} strokeWidth={1.8} />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="carrito__resumen">
              <h2>Resumen</h2>

              {estaAutenticado && (
                <div className="carrito__direccion">
                  <h3><MapPin size={16} strokeWidth={1.8} /> Dirección de envío</h3>

                  {cargandoDirecciones && <p className="carrito__direccion-estado">Cargando...</p>}

                  {!cargandoDirecciones && direcciones.length === 0 && (
                    <p className="carrito__direccion-vacio">
                      No tienes direcciones guardadas.{' '}
                      <Link to="/direcciones" state={{ from: '/carrito' }}>Agregar una</Link>
                    </p>
                  )}

                  {!cargandoDirecciones && direcciones.length > 0 && (
                    <>
                      <select value={direccionId} onChange={(e) => setDireccionId(e.target.value)}>
                        {direcciones.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.alias} — {d.direccion}, {d.ciudad}
                          </option>
                        ))}
                      </select>
                      <Link to="/direcciones" className="carrito__direccion-editar" state={{ from: '/carrito' }}>
                        Gestionar direcciones
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="carrito__resumen-linea">
                <span>Subtotal</span>
                <span>{formatearPrecio(subtotal)}</span>
              </div>
              <div className="carrito__resumen-linea">
                <span>Envío</span>
                <span>{formatearPrecio(COSTO_ENVIO)}</span>
              </div>
              <div className="carrito__resumen-linea carrito__resumen-total">
                <span>Total</span>
                <span>{formatearPrecio(total)}</span>
              </div>

              <button className="boton-primario carrito__boton-checkout" onClick={manejarCheckout} disabled={procesando}>
                {procesando ? 'Procesando...' : 'Confirmar pedido'}
              </button>

              {!estaAutenticado && (
                <p className="carrito__aviso-login">Necesitas iniciar sesión para completar la compra.</p>
              )}
            </aside>
          </div>
        )}
      </main>
    </>
  );
}