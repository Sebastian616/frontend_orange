import request from './client';

export function obtenerDirecciones(token) {
  return request('/direcciones', { token });
}

export function crearDireccion(datos, token) {
  return request('/direcciones', { method: 'POST', body: datos, token });
}

export function actualizarDireccion(id, datos, token) {
  return request(`/direcciones/${id}`, { method: 'PUT', body: datos, token });
}

export function eliminarDireccion(id, token) {
  return request(`/direcciones/${id}`, { method: 'DELETE', token });
}