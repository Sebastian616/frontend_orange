import request from './client';

export function crearPedido({ direccionId, items, costoEnvio }, token) {
  return request('/pedidos', {
    method: 'POST',
    body: { direccionId, items, costoEnvio },
    token,
  });
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