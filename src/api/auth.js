import request from './client';

export function loginUsuario({ correo, password }) {
  return request('/auth/login', { method: 'POST', body: { correo, password } });
}

export function registrarUsuario({ nombre, correo, whatsapp, password }) {
  return request('/auth/registro', { method: 'POST', body: { nombre, correo, whatsapp, password } });
}