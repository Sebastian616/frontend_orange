import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerDescuentoBienvenida } from '../api/pedidos';
import { calcularCostoEnvio } from '../config/envio';

const SIN_DESCUENTO = { disponible: false, porcentaje: 0 };

// Calcula lo que se le muestra a la persona: envío, descuento de primera compra y total.
// Es solo para mostrarlo: el servidor lo recalcula al crear el pedido.
export default function useResumenPedido(items, subtotal) {
  const { estaAutenticado, token } = useAuth();
  const [descuentoBienvenida, setDescuentoBienvenida] = useState(SIN_DESCUENTO);

  useEffect(() => {
    if (!estaAutenticado) {
      setDescuentoBienvenida(SIN_DESCUENTO);
      return;
    }
    obtenerDescuentoBienvenida(token)
      .then(setDescuentoBienvenida)
      .catch(() => setDescuentoBienvenida(SIN_DESCUENTO));
  }, [estaAutenticado, token]);

  const hayItems = items.length > 0;
  const costoEnvio = hayItems ? calcularCostoEnvio(subtotal) : 0;
  const descuento =
    hayItems && descuentoBienvenida.disponible
      ? Math.round((subtotal * descuentoBienvenida.porcentaje) / 100)
      : 0;
  const total = hayItems ? subtotal - descuento + costoEnvio : 0;

  return { costoEnvio, descuento, total, descuentoBienvenida };
}