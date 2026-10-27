import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MapPin, Banknote, Landmark, CreditCard, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { crearPedido } from '../api/pedidos';
import { obtenerDirecciones } from '../api/direcciones';
import useResumenPedido from '../hooks/useResumenPedido';
import { alertaError, alertaAviso } from '../utils/alertas';
import './Carrito.css'; // reutiliza el resumen de la derecha
import './Checkout.css';

const MINUTOS_PARA_PAGAR = 30; // debe coincidir con MINUTOS_PARA_PAGAR de pedidoService.js

const METODOS = [
  {
    id: 'EFECTIVO',
    Icono: Banknote,
    titulo: 'Efectivo',
    detalle: 'Registramos tu pedido y la tienda confirma el pago contigo.',
  },
  {
    id: 'TRANSFERENCIA',
    Icono: Landmark,
    titulo: 'Transferencia',
    detalle: 'Registramos tu pedido y la tienda confirma la transferencia contigo.',
  },
  {
    id: 'TARJETA',
    Icono: CreditCard,
    titulo: 'Tarjeta de crédito o débito',
    detalle: `Pago seguro con Mercado Pago. Tienes ${MINUTOS_PARA_PAGAR} minutos para completarlo.`,
  },
];

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function Checkout() {
  const { items, vaciarCarrito, subtotal } = useCart();
  const { estaAutenticado, token } = useAuth();
  const navigate = useNavigate();
  const { costoEnvio, descuento, total, descuentoBienvenida } = useResumenPedido(items, subtotal);

  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState('');
  const [cargandoDirecciones, setCargandoDirecciones] = useState(true);
  const [metodo, setMetodo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [redirigiendo, setRedirigiendo] = useState(false);

  // Al crear el pedido el carrito se vacía; esta marca evita que eso nos devuelva a /carrito
  const pedidoCreado = useRef(false);

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/pago' } });
      return;
    }
    obtenerDirecciones(token)
      .then((data) => {
        setDirecciones(data);
        if (data.length > 0) setDireccionId(data[0].id);
      })
      .catch(() => setDirecciones([]))
      .finally(() => setCargandoDirecciones(false));
  }, [estaAutenticado, token, navigate]);

  async function confirmar() {
    if (!direccionId) {
      alertaAviso('Selecciona (o agrega) una dirección de envío antes de continuar');
      return;
    }
    if (!metodo) {
      alertaAviso('Elige cómo quieres pagar');
      return;
    }

    setProcesando(true);
    try {
      const pedido = await crearPedido(
        {
          direccionId,
          metodoPago: metodo,
          items: items.map((i) => ({ productoId: i.productoId, tallaId: i.tallaId, cantidad: i.cantidad })),
        },
        token
      );

      pedidoCreado.current = true;
      vaciarCarrito();

      if (pedido.initPoint) {
        // Tarjeta: se sale a Mercado Pago a pagar y luego se vuelve a /pago/resultado
        setRedirigiendo(true);
        window.location.assign(pedido.initPoint);
        return;
      }
      navigate(`/pago/resultado?pedido=${pedido.id}&resultado=exito`, { replace: true });
    } catch (err) {
      alertaError(err.message || 'No pudimos procesar tu pedido');
      setProcesando(false);
    }
  }

  if (!estaAutenticado) return null;
  if (items.length === 0 && !pedidoCreado.current) return <Navigate to="/carrito" replace />;

  if (redirigiendo) {
    return (
      <>
        <Navbar />
        <main className="contenedor checkout__redirigiendo">
          <Lock size={40} strokeWidth={1.4} />
          <h1>Redirigiendo a Mercado Pago…</h1>
          <p>No cierres esta ventana. Te llevamos a pagar de forma segura.</p>
        </main>
      </>
    );
  }

  const textoBoton = procesando
    ? 'Procesando...'
    : metodo === 'TARJETA'
      ? 'Pagar con tarjeta'
      : 'Confirmar pedido';

  return (
    <>
      <Navbar />
      <main className="contenedor carrito checkout">
        <h1>Finalizar compra</h1>

        <div className="carrito__layout">
          <div className="checkout__columna">
            <section className="checkout__bloque">
              <h2><MapPin size={18} strokeWidth={1.8} /> Dirección de envío</h2>

              {cargandoDirecciones && <p className="checkout__estado">Cargando...</p>}

              {!cargandoDirecciones && direcciones.length === 0 && (
                <p className="checkout__estado">
                  No tienes direcciones guardadas.{' '}
                  <Link to="/direcciones" state={{ from: '/pago' }}>Agregar una</Link>
                </p>
              )}

              {!cargandoDirecciones && direcciones.length > 0 && (
                <>
                  <select
                    value={direccionId}
                    onChange={(e) => setDireccionId(e.target.value)}
                    aria-label="Dirección de envío"
                  >
                    {direcciones.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.alias} — {d.direccion}, {d.ciudad}
                      </option>
                    ))}
                  </select>
                  <Link to="/direcciones" className="checkout__enlace" state={{ from: '/pago' }}>
                    Gestionar direcciones
                  </Link>
                </>
              )}
            </section>

            <section className="checkout__bloque">
              <h2>Método de pago</h2>

              <div className="checkout__metodos" role="radiogroup" aria-label="Método de pago">
                {METODOS.map(({ id, Icono, titulo, detalle }) => (
                  <label
                    key={id}
                    className={`checkout__metodo ${metodo === id ? 'checkout__metodo--activo' : ''}`}
                  >
                    <input
                      type="radio"
                      name="metodo-pago"
                      value={id}
                      checked={metodo === id}
                      onChange={() => setMetodo(id)}
                    />
                    <span className="checkout__metodo-icono" aria-hidden="true">
                      <Icono size={22} strokeWidth={1.6} />
                    </span>
                    <span className="checkout__metodo-texto">
                      <strong>{titulo}</strong>
                      <small>{detalle}</small>
                    </span>
                  </label>
                ))}
              </div>

              {metodo === 'TARJETA' && (
                <p className="checkout__nota">
                  <Lock size={14} strokeWidth={1.8} />
                  Te llevamos a Mercado Pago para pagar. Nosotros no guardamos los datos de tu tarjeta.
                </p>
              )}
            </section>
          </div>

          <aside className="carrito__resumen">
            <h2>Resumen</h2>

            <div className="carrito__resumen-linea">
              <span>{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
              <span>{formatearPrecio(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="carrito__resumen-linea carrito__resumen-descuento">
                <span>Descuento primera compra ({descuentoBienvenida.porcentaje}%)</span>
                <span>-{formatearPrecio(descuento)}</span>
              </div>
            )}
            <div className="carrito__resumen-linea">
              <span>Envío</span>
              {costoEnvio === 0 ? (
                <span className="carrito__envio-gratis">Gratis</span>
              ) : (
                <span>{formatearPrecio(costoEnvio)}</span>
              )}
            </div>
            <div className="carrito__resumen-linea carrito__resumen-total">
              <span>Total</span>
              <span>{formatearPrecio(total)}</span>
            </div>

            <button
              className="boton-primario carrito__boton-checkout"
              onClick={confirmar}
              disabled={procesando || !metodo}
            >
              {textoBoton}
            </button>

            {!metodo && <p className="carrito__aviso-login">Elige un método de pago para continuar.</p>}
            <Link to="/carrito" className="checkout__enlace checkout__volver">← Volver al carrito</Link>
          </aside>
        </div>
      </main>
    </>
  );
}