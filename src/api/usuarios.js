import request from './client';

export function obtenerMiPerfil(token) {
  return request('/usuarios/me', { token });
}

export function actualizarMiPerfil(datos, token) {
  return request('/usuarios/me', { method: 'PUT', body: datos, token });
}

export function reenviarVerificacion(token) {
  return request('/auth/reenviar-verificacion', { method: 'POST', token });
}