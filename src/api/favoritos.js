import request from './client';

export function obtenerFavoritos(token) {
  return request('/favoritos', { token });
}

export function agregarFavorito(productoId, token) {
  return request('/favoritos', { method: 'POST', body: { productoId }, token });
}

export function quitarFavorito(productoId, token) {
  return request(`/favoritos/${productoId}`, { method: 'DELETE', token });
}