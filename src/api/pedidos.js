import request from './client';

// metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA'
// El costo de envío y el descuento los calcula el servidor. Con TARJETA la respuesta
// trae initPoint: la URL de Mercado Pago a la que hay que enviar a la persona.
export function crearPedido({ direccionId, items, metodoPago }, token) {
  return request('/pedidos', {
    method: 'POST',
    body: { direccionId, items, metodoPago },
    token,
  });
}

// ¿Todavía tiene el descuento de primera compra?  -> { disponible, porcentaje }
export function obtenerDescuentoBienvenida(token) {
  return request('/pedidos/descuento-bienvenida', { token });
}

// (Re)inicia el pago con tarjeta de un pedido pendiente  -> { initPoint }
export function iniciarPagoTarjeta(pedidoId, token) {
  return request(`/pagos/pedido/${pedidoId}/iniciar`, { method: 'POST', token });
}

export function obtenerMisPedidos(token) {
  return request('/pedidos', { token });
}

export function obtenerHistorialPedido(pedidoId, token) {
  return request(`/pedidos/${pedidoId}/historial`, { token });
}

// --- Administración (requieren token de admin) ---

export function obtenerTodosLosPedidos(token, estado) {
  const query = estado ? `?estado=${estado}` : '';
  return request(`/pedidos/admin/todos${query}`, { token });
}

export function obtenerPedidoPorId(pedidoId, token) {
  return request(`/pedidos/${pedidoId}`, { token });
}

export function cambiarEstadoPedido(pedidoId, { estado, comentario }, token) {
  return request(`/pedidos/${pedidoId}/estado`, {
    method: 'PATCH',
    body: { estado, comentario },
    token,
  });
}