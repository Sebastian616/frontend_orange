import request from './client';

export function obtenerCategorias() {
  return request('/categorias');
}
