import request from './client';

export function obtenerTallasCatalogo() {
  return request('/tallas');
}

export function asignarTallaProducto(productoId, { tallaId, stock }, token) {
  return request(`/productos/${productoId}/tallas`, {
    method: 'POST',
    body: { tallaId, stock },
    token,
  });
}

export function actualizarStockTalla(productoId, tallaId, { stock }, token) {
  return request(`/productos/${productoId}/tallas/${tallaId}`, {
    method: 'PUT',
    body: { stock },
    token,
  });
}

export function quitarTallaProducto(productoId, tallaId, token) {
  return request(`/productos/${productoId}/tallas/${tallaId}`, {
    method: 'DELETE',
    token,
  });
}