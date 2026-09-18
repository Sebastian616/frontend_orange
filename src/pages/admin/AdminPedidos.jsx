import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function AdminPedidos() {
  const { token } = useAuth();

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

  function alternarPedido(pedidoId) {
    const yaAbierto = pedidoAbierto === pedidoId;
    setPedidoAbierto(yaAbierto ? null : pedidoId);

    if (!yaAbierto && !detalles[pedidoId]) {
      obtenerPedidoPorId(pedidoId, token)
        .then((data) => setDetalles((prev) => ({ ...prev, [pedidoId]: data })))
        .catch(() => alertaError('No pudimos cargar el detalle de este pedido'));
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

            return (
              <li key={pedido.id} className="mis-pedidos__pedido">
                <button className="mis-pedidos__cabecera" onClick={() => alternarPedido(pedido.id)}>
                  <div>
                    <p className="mis-pedidos__numero">#{pedido.id.slice(0, 8)} — {pedido.usuario_nombre}</p>
                    <p className="mis-pedidos__fecha">{pedido.usuario_correo} · {formatearFecha(pedido.created_at)}</p>
                  </div>
                  <span className={`admin-badge ${badgeClase}`}>{pedido.estado}</span>
                  <p className="mis-pedidos__total">{formatearPrecio(pedido.total)}</p>
                  <ChevronDown size={20} className={abierto ? 'mis-pedidos__flecha--abierta' : ''} />
                </button>

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