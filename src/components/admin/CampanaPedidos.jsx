import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { usePedidosNotificaciones } from '../../context/PedidosNotificacionesContext';

// Guarda este archivo en: src/components/admin/CampanaPedidos.jsx

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CampanaPedidos() {
  const { pedidosNuevos, marcarComoVisto, marcarTodosComoVistos } = usePedidosNotificaciones();
  const [abierta, setAbierta] = useState(false);
  const navigate = useNavigate();

  function irAPedido(pedidoId) {
    setAbierta(false);
    marcarComoVisto(pedidoId);
    navigate(`/admin/pedidos?pedido=${pedidoId}`);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setAbierta((v) => !v)}
        title="Pedidos nuevos"
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
      >
        <Bell size={20} />
        {pedidosNuevos.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: '#e11d48',
              color: '#fff',
              borderRadius: '999px',
              fontSize: 11,
              lineHeight: 1,
              padding: '3px 6px',
              fontWeight: 700,
            }}
          >
            {pedidosNuevos.length}
          </span>
        )}
      </button>

      {abierta && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            width: 300,
            maxHeight: 360,
            overflowY: 'auto',
            zIndex: 30,
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <strong style={{ fontSize: 14 }}>Pedidos nuevos</strong>
            {pedidosNuevos.length > 0 && (
              <button
                onClick={() => {
                  marcarTodosComoVistos();
                  setAbierta(false);
                }}
                style={{ fontSize: 12, background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
              >
                Marcar todos como vistos
              </button>
            )}
          </div>

          {pedidosNuevos.length === 0 ? (
            <p style={{ padding: 12, fontSize: 13, color: '#6b7280' }}>No hay pedidos nuevos.</p>
          ) : (
            pedidosNuevos.map((p) => (
              <button
                key={p.id}
                onClick={() => irAPedido(p.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  border: 'none',
                  borderBottom: '1px solid #f3f4f6',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>#{p.id.slice(0, 8)} — {p.usuario_nombre}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{formatearPrecio(p.total)} · {formatearFecha(p.created_at)}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}