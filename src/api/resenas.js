import request from './client';

export function obtenerResenas(productoId) {
  return request(`/productos/${productoId}/resenas`);
}

export function obtenerResumenResenas(productoId) {
  return request(`/productos/${productoId}/resenas/resumen`);
}

export function puedoResenarProducto(productoId, token) {
  return request(`/productos/${productoId}/resenas/puedo-resenar`, { token });
}

export function crearResena(productoId, { calificacion, comentario }, token) {
  return request(`/productos/${productoId}/resenas`, {
    method: 'POST',
    body: { calificacion, comentario },
    token,
  });
}