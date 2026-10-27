import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { obtenerPedidoPorId, iniciarPagoTarjeta } from '../api/pedidos';
import { alertaError } from '../utils/alertas';
import './PagoResultado.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export default function PagoResultado() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { estaAutenticado, token } = useAuth();

  const pedidoId = params.get('pedido');
  const resultado = params.get('resultado') || 'pendiente'; // exito | fallo | pendiente

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [reintentando, setReintentando] = useState(false);
  const intentos = useRef(0);

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
      return undefined;
    }
    if (!pedidoId) {
      setCargando(false);
      return undefined;
    }

    let cancelado = false;
    let temporizador;

    async function cargar() {
      try {
        const data = await obtenerPedidoPorId(pedidoId, token);
        if (cancelado) return;
        setPedido(data);

        // Pago con tarjeta que aún figura pendiente: el aviso de Mercado Pago puede tardar unos
        // segundos, así que se vuelve a consultar un rato antes de rendirse.
        const esperandoConfirmacion =
          data.metodo_pago === 'TARJETA' && data.estado === 'PENDIENTE' && resultado !== 'fallo';
        if (esperandoConfirmacion && intentos.current < 8) {
          intentos.current += 1;
          temporizador = setTimeout(cargar, 3000);
        }
      } catch {
        if (!cancelado) setPedido(null);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    cargar();

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [estaAutenticado, pedidoId, token, resultado, navigate, location.pathname, location.search]);

  async function reintentarPago() {
    setReintentando(true);
    try {
      const { initPoint } = await iniciarPagoTarjeta(pedido.id, token);
      window.location.assign(initPoint);
    } catch (err) {
      alertaError(err.message || 'No pudimos iniciar el pago');
      setReintentando(false);
    }
  }

  if (!estaAutenticado) return null;

  if (cargando) {
    return (
      <>
        <Navbar />
        <main className="contenedor pago-resultado">
          <p className="pago-resultado__texto">Consultando tu pedido...</p>
        </main>
      </>
    );
  }

  if (!pedido) {
    return (
      <>
        <Navbar />
        <main className="contenedor pago-resultado">
          <XCircle size={48} strokeWidth={1.3} />
          <h1>No encontramos tu pedido</h1>
          <p className="pago-resultado__texto">Revisa el estado de tus compras en "Mis pedidos".</p>
          <div className="pago-resultado__acciones">
            <Link to="/pedidos" className="boton-primario">Ver mis pedidos</Link>
          </div>
        </main>
      </>
    );
  }

  const esTarjeta = pedido.metodo_pago === 'TARJETA';
  const pagado = esTarjeta && Boolean(pedido.pagado_at) && pedido.estado !== 'CANCELADO';
  const cancelado = pedido.estado === 'CANCELADO';

  let contenido;

  if (!esTarjeta) {
    // Efectivo / transferencia (o pedidos anteriores): se registra el pedido y la tienda confirma el pago
    contenido = {
      Icono: ShoppingBag,
      titulo: '¡Pedido confirmado!',
      texto: `Tu pedido quedó registrado con estado ${pedido.estado}.`,
    };
  } else if (pagado) {
    contenido = {
      Icono: CheckCircle2,
      titulo: '¡Pago aprobado!',
      texto: 'Recibimos tu pago con Mercado Pago y tu pedido quedó confirmado.',
    };
  } else if (cancelado) {
    contenido = {
      Icono: XCircle,
      titulo: 'Tu pedido fue cancelado',
      texto: 'El pago no se completó a tiempo, así que liberamos los productos. Puedes volver a intentarlo desde la tienda.',
    };
  } else if (resultado === 'fallo') {
    contenido = {
      Icono: XCircle,
      titulo: 'No pudimos completar tu pago',
      texto: 'Tu pedido sigue reservado por unos minutos. Puedes intentar pagar de nuevo.',
      reintentar: true,
    };
  } else {
    contenido = {
      Icono: Clock,
      titulo: 'Estamos confirmando tu pago',
      texto: 'Si ya pagaste, se confirmará en unos minutos. Puedes revisar el estado en "Mis pedidos".',
    };
  }

  const { Icono } = contenido;

  return (
    <>
      <Navbar />
      <main className="contenedor pago-resultado">
        <Icono size={52} strokeWidth={1.3} />
        <h1>{contenido.titulo}</h1>
        <p className="pago-resultado__texto">{contenido.texto}</p>
        <p className="pago-resultado__total">Total: {formatearPrecio(pedido.total)}</p>

        <div className="pago-resultado__acciones">
          {contenido.reintentar && (
            <button className="boton-primario" onClick={reintentarPago} disabled={reintentando}>
              {reintentando ? 'Abriendo Mercado Pago...' : 'Reintentar pago'}
            </button>
          )}
          <Link to="/pedidos" className={contenido.reintentar ? 'boton-secundario' : 'boton-primario'}>
            Ver mis pedidos
          </Link>
          {!contenido.reintentar && <Link to="/tienda" className="boton-secundario">Seguir comprando</Link>}
        </div>
      </main>
    </>
  );
}