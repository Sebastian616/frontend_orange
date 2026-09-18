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