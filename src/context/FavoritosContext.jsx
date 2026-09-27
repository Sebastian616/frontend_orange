import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../api/favoritos';
import { useAuth } from './AuthContext';
import { toastError } from '../utils/alertas';

const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const { token, estaAutenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Guarda los productos completos (tu backend ya los devuelve así en
  // GET /favoritos), no solo los ids — así la página de Favoritos no
  // necesita hacer una llamada extra a la API.
  const [productosFavoritos, setProductosFavoritos] = useState([]);
  const [cargandoFavoritos, setCargandoFavoritos] = useState(true);

  const favoritosIds = useMemo(
    () => new Set(productosFavoritos.map((p) => p.id)),
    [productosFavoritos]
  );

  const cargarFavoritos = useCallback(() => {
    if (!estaAutenticado) {
      setProductosFavoritos([]);
      setCargandoFavoritos(false);
      return;
    }
    setCargandoFavoritos(true);
    obtenerFavoritos(token)
      .then((data) => setProductosFavoritos(data || []))
      .catch(() => setProductosFavoritos([]))
      .finally(() => setCargandoFavoritos(false));
  }, [estaAutenticado, token]);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  function esFavorito(productoId) {
    return favoritosIds.has(productoId);
  }

  async function toggleFavorito(producto) {
    if (!estaAutenticado) {
      // Manda a login y recuerda a dónde volver
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const yaEsFavorito = favoritosIds.has(producto.id);

    // Actualización optimista: se ve el cambio al instante en la UI
    setProductosFavoritos((prev) =>
      yaEsFavorito ? prev.filter((p) => p.id !== producto.id) : [...prev, producto]
    );

    try {
      if (yaEsFavorito) {
        await quitarFavorito(producto.id, token);
      } else {
        await agregarFavorito(producto.id, token);
      }
    } catch (err) {
      // Si falla, revierte el cambio optimista
      setProductosFavoritos((prev) =>
        yaEsFavorito
          ? [...prev, producto]
          : prev.filter((p) => p.id !== producto.id)
      );
      console.error('Error al actualizar favoritos:', err.message);
      toastError('No pudimos actualizar tus favoritos');
    }
  }

  const valor = {
    productosFavoritos,
    cargandoFavoritos,
    favoritosIds,
    esFavorito,
    toggleFavorito,
    recargar: cargarFavoritos,
  };

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) {
    throw new Error('useFavoritos debe usarse dentro de <FavoritosProvider>');
  }
  return contexto;
}