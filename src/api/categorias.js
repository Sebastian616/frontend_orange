import request from './client';
import { obtenerProductos } from './productos';

export function obtenerCategorias() {
  return request('/categorias');
}

// Devuelve cada categoría con:
//  - imagen: primera foto de su producto más reciente (o null si no tiene)
//  - totalProductos: cuántos productos activos tiene
// Reutiliza el GET /productos que ya filtra por categoría, así que no
// requiere cambios en el backend.
export async function obtenerCategoriasConImagen() {
  const categorias = await obtenerCategorias();

  return Promise.all(
    categorias.map(async (cat) => {
      try {
        const data = await obtenerProductos({ categoria: cat.id, limit: 1 });
        return {
          ...cat,
          imagen: data.productos?.[0]?.fotos?.[0] || null,
          totalProductos: data.paginacion?.total ?? 0,
        };
      } catch {
        return { ...cat, imagen: null, totalProductos: null };
      }
    })
  );
}