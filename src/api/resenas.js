import request from './client';

export function obtenerResenas(productoId) {
  return request(`/productos/${productoId}/resenas`);
}

export function obtenerResumenResenas(productoId) {
  return request(`/productos/${productoId}/resenas/resumen`);
}

export function crearResena(productoId, { calificacion, comentario }, token) {
  return request(`/productos/${productoId}/resenas`, {
    method: 'POST',
    body: { calificacion, comentario },
    token,
  });
}