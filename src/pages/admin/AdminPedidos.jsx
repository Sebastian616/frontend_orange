import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePedidosNotificaciones } from '../../context/PedidosNotificacionesContext';
import { obtenerTodosLosPedidos, obtenerPedidoPorId, cambiarEstadoPedido } from '../../api/pedidos';
import { alertaError, alertaConfirmar, toastExito } from '../../utils/alertas';
import '../MisPedidos.css';
import './Admin.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

// AJUSTA AQUÍ el nombre real del campo si tu API usa otro distinto a estos
function obtenerTelefono(pedido) {
  return pedido.usuario_telefono || pedido.telefono || pedido.usuario_celular || pedido.celular || null;
}

function limpiarTelefono(telefono) {
  if (!telefono) return null;
  const soloDigitos = telefono.replace(/\D/g, '');
  if (!soloDigitos) return null;
  // Si parece un celular colombiano sin indicativo (10 dígitos, empieza en 3), le agregamos 57
  if (soloDigitos.length === 10 && soloDigitos.startsWith('3')) return `57${soloDigitos}`;
  return soloDigitos;
}

function generarEnlaceWhatsApp(pedido) {
  const numero = limpiarTelefono(obtenerTelefono(pedido));
  if (!numero) return null;
  const mensaje = `Hola ${pedido.usuario_nombre}, te escribo sobre tu pedido #${pedido.id.slice(0, 8)}.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function AdminPedidos() {
  const { token } = useAuth();
  const { pedidosNuevos, marcarComoVisto } = usePedidosNotificaciones();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pedidos, setPedidos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [pedidoAbierto, setPedidoAbierto] = useState(null);
  const [detalles, setDetalles] = useState({});
  const [nuevoEstadoPorPedido, setNuevoEstadoPorPedido] = useState({});
  const [guardandoEstado, setGuardandoEstado] = useState(null);

  useEffect(() => {
    cargar();
  }, [filtroEstado]);

  function cargar() {
    setCargando(true);
    obtenerTodosLosPedidos(token, filtroEstado || undefined)
      .then(setPedidos)
      .catch(() => alertaError('No pudimos cargar los pedidos'))
      .finally(() => setCargando(false));
  }

  // Si llegamos desde la campana (AdminLayout) con ?pedido=ID, lo abrimos y resaltamos
  useEffect(() => {
    const pedidoId = searchParams.get('pedido');
    if (!pedidoId || cargando) return;

    setPedidoAbierto(pedidoId);
    marcarComoVisto(pedidoId);
    if (!detalles[pedidoId]) {
      obtenerPedidoPorId(pedidoId, token)
        .then((data) => setDetalles((prev) => ({ ...prev, [pedidoId]: data })))
        .catch(() => alertaError('No pudimos cargar el detalle de este pedido'));
    }
    setTimeout(() => {
      document.getElementById(`pedido-${pedidoId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);

    setSearchParams({}, { replace: true }); // limpia el query param para no reabrirlo al navegar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargando]);

  function alternarPedido(pedidoId) {
    const yaAbierto = pedidoAbierto === pedidoId;
    setPedidoAbierto(yaAbierto ? null : pedidoId);
    marcarComoVisto(pedidoId);

    if (!yaAbierto && !detalles[pedidoId]) {
      obtenerPedidoPorId(pedidoId, token)
        .then((data) => setDetalles((prev) => ({ ...prev, [pedidoId]: data })))
        .catch(() => alertaError('No pudimos cargar el detalle de este pedido'));
    }
  }

  function manejarTeclaCabecera(e, pedidoId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      alternarPedido(pedidoId);
    }
  }

  async function guardarNuevoEstado(pedido) {
    const nuevoEstado = nuevoEstadoPorPedido[pedido.id];
    if (!nuevoEstado || nuevoEstado === pedido.estado) return;

    const confirmado = await alertaConfirmar(
      `Vas a cambiar el pedido #${pedido.id.slice(0, 8)} a "${nuevoEstado}".`,
      '¿Confirmar cambio de estado?'
    );
    if (!confirmado) return;

    setGuardandoEstado(pedido.id);
    try {
      await cambiarEstadoPedido(pedido.id, { estado: nuevoEstado }, token);
      toastExito('Estado actualizado');
      cargar();
      setDetalles((prev) => {
        const copia = { ...prev };
        delete copia[pedido.id];
        return copia;
      });
    } catch (err) {
      alertaError(err.message || 'No pudimos cambiar el estado');
    } finally {
      setGuardandoEstado(null);
    }
  }

  return (
    <div>
      <div className="admin-cabecera">
        <h1>Pedidos</h1>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {cargando ? (
        <p>Cargando pedidos...</p>
      ) : (
        <ul className="mis-pedidos__lista">
          {pedidos.map((pedido) => {
            const abierto = pedidoAbierto === pedido.id;
            const detalle = detalles[pedido.id];
            const badgeClase = pedido.estado === 'CANCELADO' ? 'admin-badge--cancelado' : 'admin-badge--activo';
            const esNuevo = pedidosNuevos.some((p) => p.id === pedido.id);
            const enlaceWhatsApp = generarEnlaceWhatsApp(pedido);

            return (
              <li
                key={pedido.id}
                id={`pedido-${pedido.id}`}
                className="mis-pedidos__pedido"
                style={esNuevo ? { borderLeft: '4px solid #e11d48', background: '#fff1f2' } : undefined}
              >
                <div
                  className="mis-pedidos__cabecera"
                  role="button"
                  tabIndex={0}
                  onClick={() => alternarPedido(pedido.id)}
                  onKeyDown={(e) => manejarTeclaCabecera(e, pedido.id)}
                >
                  <div>
                    <p className="mis-pedidos__numero">
                      {esNuevo && (
                        <span style={{ color: '#e11d48', fontSize: 11, fontWeight: 700, marginRight: 6 }}>NUEVO</span>
                      )}
                      #{pedido.id.slice(0, 8)} — {pedido.usuario_nombre}
                    </p>
                    <p className="mis-pedidos__fecha">
                      {pedido.usuario_correo} · {formatearFecha(pedido.created_at)}
                      {enlaceWhatsApp && (
                        <>
                          {' · '}
                          <a
                            href={enlaceWhatsApp}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: '#25D366',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <span className={`admin-badge ${badgeClase}`}>{pedido.estado}</span>
                  <p className="mis-pedidos__total">{formatearPrecio(pedido.total)}</p>
                  <ChevronDown size={20} className={abierto ? 'mis-pedidos__flecha--abierta' : ''} />
                </div>

                {abierto && (
                  <div className="mis-pedidos__detalle">
                    <div className="mis-pedidos__productos">
                      <h3>Productos</h3>
                      {!detalle && <p>Cargando...</p>}
                      {detalle && (
                        <ul>
                          {detalle.detalles?.map((d) => (
                            <li key={d.id}>
                              <span>{d.cantidad}x {d.producto_nombre} (talla {d.talla})</span>
                              <span>{formatearPrecio(d.precio_unitario * d.cantidad)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mis-pedidos__resumen-costos">
                        <div><span>Subtotal</span><span>{formatearPrecio(pedido.subtotal)}</span></div>
                        <div><span>Envío</span><span>{formatearPrecio(pedido.costo_envio)}</span></div>
                      </div>
                    </div>

                    <div>
                      <h3>Cambiar estado</h3>
                      <div className="admin-form-fila" style={{ gridTemplateColumns: '1fr auto' }}>
                        <select
                          value={nuevoEstadoPorPedido[pedido.id] ?? pedido.estado}
                          onChange={(e) => setNuevoEstadoPorPedido((prev) => ({ ...prev, [pedido.id]: e.target.value }))}
                          disabled={pedido.estado === 'CANCELADO' || pedido.estado === 'ENTREGADO'}
                        >
                          {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <button
                          className="boton-primario"
                          onClick={() => guardarNuevoEstado(pedido)}
                          disabled={guardandoEstado === pedido.id || pedido.estado === 'CANCELADO' || pedido.estado === 'ENTREGADO'}
                        >
                          Guardar
                        </button>
                      </div>
                      {(pedido.estado === 'CANCELADO' || pedido.estado === 'ENTREGADO') && (
                        <p className="mis-pedidos__estado" style={{ marginTop: 8 }}>
                          Un pedido {pedido.estado.toLowerCase()} ya no puede cambiar de estado.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}