import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { obtenerTodosLosPedidos } from '../api/pedidos';
import { toastExito } from '../utils/alertas';

const CLAVE_VISTOS = 'admin_pedidos_vistos';
const INTERVALO_REVISION_MS = 20000; // cada 20 segundos

function leerVistosGuardados() {
  try {
    return new Set(JSON.parse(localStorage.getItem(CLAVE_VISTOS) || '[]'));
  } catch {
    return new Set();
  }
}

function guardarVistos(set) {
  try {
    localStorage.setItem(CLAVE_VISTOS, JSON.stringify([...set]));
  } catch {
    // localStorage no disponible; simplemente no persistimos
  }
}

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

// Beep corto generado con Web Audio API, no requiere ningún archivo de audio externo
function reproducirBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // audio no disponible en este navegador, ignorar
  }
}

function notificarNavegador(pedido) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    new Notification('Nuevo pedido', {
      body: `${pedido.usuario_nombre} — ${formatearPrecio(pedido.total)}`,
    });
  }
}

const PedidosNotificacionesContext = createContext(null);

export function PedidosNotificacionesProvider({ children }) {
  const { token } = useAuth();
  const [pedidosNuevos, setPedidosNuevos] = useState([]);
  const idsVistosRef = useRef(leerVistosGuardados());
  const primerChequeoRef = useRef(true);

  // Pide permiso de notificaciones del navegador una vez (opcional, el admin puede negarlo)
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Polling global: vive mientras el admin esté dentro de /admin/*, sin importar la subpágina
  useEffect(() => {
    if (!token) return;
    let activo = true;

    async function revisarNuevos() {
      try {
        const todos = await obtenerTodosLosPedidos(token); // sin filtro, para detectar cualquier pedido nuevo
        if (!activo) return;

        const noVistos = todos.filter((p) => !idsVistosRef.current.has(p.id));

        setPedidosNuevos((prevNuevos) => {
          const idsPrevios = new Set(prevNuevos.map((p) => p.id));
          const realmenteNuevos = noVistos.filter((p) => !idsPrevios.has(p.id));

          // En la primera revisión no hacemos ruido, solo mostramos el contador
          if (!primerChequeoRef.current && realmenteNuevos.length > 0) {
            realmenteNuevos.forEach((p) => {
              toastExito(`Nuevo pedido de ${p.usuario_nombre} — ${formatearPrecio(p.total)}`);
              notificarNavegador(p);
            });
            reproducirBeep();
          }

          return noVistos;
        });

        primerChequeoRef.current = false;
      } catch {
        // revisión silenciosa; no interrumpimos al admin si falla una vez
      }
    }

    revisarNuevos();
    const intervalo = setInterval(revisarNuevos, INTERVALO_REVISION_MS);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, [token]);

  function marcarComoVisto(pedidoId) {
    if (!idsVistosRef.current.has(pedidoId)) {
      idsVistosRef.current.add(pedidoId);
      guardarVistos(idsVistosRef.current);
      setPedidosNuevos((prev) => prev.filter((p) => p.id !== pedidoId));
    }
  }

  function marcarTodosComoVistos() {
    pedidosNuevos.forEach((p) => idsVistosRef.current.add(p.id));
    guardarVistos(idsVistosRef.current);
    setPedidosNuevos([]);
  }

  return (
    <PedidosNotificacionesContext.Provider value={{ pedidosNuevos, marcarComoVisto, marcarTodosComoVistos }}>
      {children}
    </PedidosNotificacionesContext.Provider>
  );
}

export function usePedidosNotificaciones() {
  const ctx = useContext(PedidosNotificacionesContext);
  if (!ctx) {
    throw new Error('usePedidosNotificaciones debe usarse dentro de <PedidosNotificacionesProvider>');
  }
  return ctx;
}