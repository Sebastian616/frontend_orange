import { createContext, useContext, useState, useEffect } from 'react';
//basico
const CartContext = createContext(null);
const CLAVE_STORAGE = 'orange_carrito';

function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

function mismaVariante(item, productoId, tallaId) {
  return item.productoId === productoId && item.tallaId === tallaId;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado);

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  }, [items]);

  // producto: objeto producto completo. talla: { talla_id, talla, stock }.
  function agregarAlCarrito(producto, talla, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => mismaVariante(i, producto.id, talla.talla_id));

      if (existente) {
        const nuevaCantidad = Math.min(existente.cantidad + cantidad, talla.stock);
        return prev.map((i) =>
          mismaVariante(i, producto.id, talla.talla_id) ? { ...i, cantidad: nuevaCantidad } : i
        );
      }

      return [
        ...prev,
        {
          productoId: producto.id,
          tallaId: talla.talla_id,
          talla: talla.talla,
          stockMax: talla.stock,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          foto: producto.fotos?.[0] || null,
          cantidad: Math.min(cantidad, talla.stock),
        },
      ];
    });
  }

  function actualizarCantidad(productoId, tallaId, nuevaCantidad) {
    setItems((prev) =>
      prev.map((i) =>
        mismaVariante(i, productoId, tallaId)
          ? { ...i, cantidad: Math.max(1, Math.min(nuevaCantidad, i.stockMax)) }
          : i
      )
    );
  }

  function quitarDelCarrito(productoId, tallaId) {
    setItems((prev) => prev.filter((i) => !mismaVariante(i, productoId, tallaId)));
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);
  const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const valor = {
    items,
    agregarAlCarrito,
    actualizarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    cantidadTotal,
    subtotal,
  };

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return contexto;
}