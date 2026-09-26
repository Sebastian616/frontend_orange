import request from './client';

export function loginUsuario({ correo, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: {
      correo: correo ? correo.trim().toLowerCase() : '',
      password,
    },
  });
}

export function registrarUsuario({ nombre, correo, whatsapp, password }) {
  return request('/auth/registro', {
    method: 'POST',
    body: {
      nombre,
      correo: correo ? correo.trim().toLowerCase() : '',
      whatsapp,
      password,
    },
  });
}

export function olvidePassword({ correo }) {
  return request('/auth/olvide-password', {
    method: 'POST',
    body: {
      correo: correo ? correo.trim().toLowerCase() : '',
    },
  });
}

export function resetearPassword({ token, password }) {
  return request('/auth/resetear-password', {
    method: 'POST',
    body: { token, password },
  });
}
