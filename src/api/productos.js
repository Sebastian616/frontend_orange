import request from './client';

// Trae productos destacados para la home (los más recientes, límite corto)
export function obtenerProductosDestacados(limit = 4) {
  return request(`/productos?orden=recientes&limit=${limit}`);
}

// Trae productos con filtros para la página de tienda (categoría, búsqueda, precio, orden, paginación)
export function obtenerProductos(params = {}) {
  const limpios = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  const query = new URLSearchParams(limpios).toString();
  return request(`/productos${query ? `?${query}` : ''}`);
}

export function obtenerProductoPorId(id) {
  return request(`/productos/${id}`);
}

// --- Administración (requieren token de admin) ---

export function obtenerProductosAdmin(token) {
  return request('/productos/admin/todos', { token });
}

export function crearProducto(datos, token) {
  return request('/productos', { method: 'POST', body: datos, token });
}

export function actualizarProducto(id, datos, token) {
  return request(`/productos/${id}`, { method: 'PUT', body: datos, token });
}

export function desactivarProducto(id, token) {
  return request(`/productos/${id}`, { method: 'DELETE', token });
}

export function reactivarProducto(id, token) {
  return request(`/productos/${id}/reactivar`, { method: 'PATCH', token });
}