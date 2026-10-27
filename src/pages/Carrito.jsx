import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import useResumenPedido from '../hooks/useResumenPedido';
import BarraEnvioGratis from '../components/BarraEnvioGratis';
import './Carrito.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function Carrito() {
  const { items, actualizarCantidad, quitarDelCarrito, subtotal } = useCart();
  const { estaAutenticado } = useAuth();
  const navigate = useNavigate();
  const { costoEnvio, descuento, total, descuentoBienvenida } = useResumenPedido(items, subtotal);

  return (
    <>
      <Navbar />
      <main className="contenedor carrito">
        <h1>Tu carrito</h1>

        {items.length > 0 && <BarraEnvioGratis subtotal={subtotal} />}

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

              <div className="carrito__resumen-linea">
                <span>Subtotal</span>
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

              <button className="boton-primario carrito__boton-checkout" onClick={() => navigate('/pago')}>
                Continuar al pago
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