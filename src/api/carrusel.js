import { obtenerProductos } from './productos';

const MAX_PAGINAS = 20; // tope de seguridad por si el catálogo crece mucho

// Trae las fotos de TODOS los productos activos (recorre todas las páginas
// de GET /productos). Devuelve una lista plana:
//   [{ url, productoId, nombre }, ...]
export async function obtenerFotosCarrusel() {
  const fotos = [];
  let pagina = 1;
  let totalPaginas = 1;

  do {
    const data = await obtenerProductos({ page: pagina, limit: 50 });

    for (const producto of data.productos || []) {
      for (const url of producto.fotos || []) {
        fotos.push({ url, productoId: producto.id, nombre: producto.nombre });
      }
    }

    totalPaginas = data.paginacion?.totalPaginas ?? 1;
    pagina += 1;
  } while (pagina <= totalPaginas && pagina <= MAX_PAGINAS);

  return fotos;
}