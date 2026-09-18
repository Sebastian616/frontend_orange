import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { obtenerMisPedidos, obtenerHistorialPedido } from '../api/pedidos';
import { toastError } from '../utils/alertas';
import './MisPedidos.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREPARACION: 'En preparación',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

export default function MisPedidos() {
  const { estaAutenticado, token } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoAbierto, setPedidoAbierto] = useState(null);
  const [historiales, setHistoriales] = useState({});

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/pedidos' } });
      return;
    }

    obtenerMisPedidos(token)
      .then(setPedidos)
      .catch(() => toastError('No pudimos cargar tus pedidos'))
      .finally(() => setCargando(false));
  }, [estaAutenticado, token, navigate]);

  function alternarPedido(pedidoId) {
    const yaAbierto = pedidoAbierto === pedidoId;
    setPedidoAbierto(yaAbierto ? null : pedidoId);

    if (!yaAbierto && !historiales[pedidoId]) {
      obtenerHistorialPedido(pedidoId, token)
        .then((data) => setHistoriales((prev) => ({ ...prev, [pedidoId]: data })))
        .catch(() => toastError('No pudimos cargar el seguimiento de este pedido'));
    }
  }

  return (
    <>
      <Navbar />
      <main className="contenedor mis-pedidos">
        <h1>Mis pedidos</h1>

        {cargando && <p className="mis-pedidos__estado">Cargando tus pedidos...</p>}

        {!cargando && pedidos.length === 0 && (
          <div className="mis-pedidos__vacio">
            <Package size={40} strokeWidth={1.3} />
            <p>Todavía no has hecho ningún pedido.</p>
            <Link to="/tienda" className="boton-primario">Ir a la tienda</Link>
          </div>
        )}

        <ul className="mis-pedidos__lista">
          {pedidos.map((pedido) => {
            const abierto = pedidoAbierto === pedido.id;
            const historial = historiales[pedido.id];
            const estadoClase = pedido.estado === 'CANCELADO' ? 'mis-pedidos__badge--cancelado' : '';

            return (
              <li key={pedido.id} className="mis-pedidos__pedido">
                <button className="mis-pedidos__cabecera" onClick={() => alternarPedido(pedido.id)}>
                  <div>
                    <p className="mis-pedidos__numero">Pedido #{pedido.id.slice(0, 8)}</p>
                    <p className="mis-pedidos__fecha">{formatearFecha(pedido.created_at)}</p>
                  </div>
                  <span className={`mis-pedidos__badge ${estadoClase}`}>
                    {ETIQUETA_ESTADO[pedido.estado] || pedido.estado}
                  </span>
                  <p className="mis-pedidos__total">{formatearPrecio(pedido.total)}</p>
                  <ChevronDown size={20} className={abierto ? 'mis-pedidos__flecha--abierta' : ''} />
                </button>

                {abierto && (
                  <div className="mis-pedidos__detalle">
                    <div className="mis-pedidos__productos">
                      <h3>Productos</h3>
                      <ul>
                        {pedido.detalles?.map((d) => (
                          <li key={d.id}>
                            <span>{d.cantidad}x {d.producto_nombre} (talla {d.talla})</span>
                            <span>{formatearPrecio(d.precio_unitario * d.cantidad)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mis-pedidos__resumen-costos">
                        <div><span>Subtotal</span><span>{formatearPrecio(pedido.subtotal)}</span></div>
                        <div><span>Envío</span><span>{formatearPrecio(pedido.costo_envio)}</span></div>
                      </div>
                    </div>

                    <div className="mis-pedidos__seguimiento">
                      <h3>Seguimiento</h3>
                      {!historial && <p className="mis-pedidos__estado">Cargando seguimiento...</p>}
                      {historial && (
                        <ul className="mis-pedidos__timeline">
                          {historial.map((paso) => (
                            <li key={paso.id}>
                              <span className="mis-pedidos__timeline-punto" />
                              <div>
                                <p className="mis-pedidos__timeline-estado">
                                  {ETIQUETA_ESTADO[paso.estado] || paso.estado}
                                </p>
                                <p className="mis-pedidos__timeline-fecha">
                                  {new Date(paso.created_at).toLocaleString('es-CO')}
                                </p>
                                {paso.comentario && <p className="mis-pedidos__timeline-comentario">{paso.comentario}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}