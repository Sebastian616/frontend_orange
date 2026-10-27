// Reglas de envío que MUESTRA el frontend (barra del carrito, banner de la Home).
//
// OJO: quien decide de verdad el costo al crear el pedido es el backend
// (pedidoService.js tiene las mismas dos constantes). Si cambias estos
// valores, cámbialos también allá para que ambos lados coincidan.
export const ENVIO_GRATIS_DESDE = 80000; // subtotal de productos, en pesos
export const COSTO_ENVIO_ESTANDAR = 100;

export function calcularCostoEnvio(subtotal) {
  return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO_ESTANDAR;
}