import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerFavoritos, agregarFavorito, quitarFavorito } from '../api/favoritos';
import { useAuth } from './Authcontext';
import { toastError } from '../utils/alertas';

const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const { token, estaAutenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set con los productoId que están marcados como favoritos
  const [favoritos, setFavoritos] = useState(new Set());

  const cargarFavoritos = useCallback(() => {
    if (!estaAutenticado) {
      setFavoritos(new Set());
      return;
    }
    obtenerFavoritos(token)
      .then((data) => {
        const ids = (data || []).map((f) => f.id);
        setFavoritos(new Set(ids));
      })
      .catch(() => setFavoritos(new Set()));
  }, [estaAutenticado, token]);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  function esFavorito(productoId) {
    return favoritos.has(productoId);
  }

  async function toggleFavorito(producto) {
    if (!estaAutenticado) {
      // Manda a login y recuerda a dónde volver
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const yaEsFavorito = favoritos.has(producto.id);

    // Actualización optimista: se ve el cambio al instante en la UI
    setFavoritos((prev) => {
      const nuevo = new Set(prev);
      if (yaEsFavorito) nuevo.delete(producto.id);
      else nuevo.add(producto.id);
      return nuevo;
    });

    try {
      if (yaEsFavorito) {
        await quitarFavorito(producto.id, token);
      } else {
        await agregarFavorito(producto.id, token);
      }
    } catch (err) {
      // Si falla, revierte el cambio optimista
      setFavoritos((prev) => {
        const nuevo = new Set(prev);
        if (yaEsFavorito) nuevo.add(producto.id);
        else nuevo.delete(producto.id);
        return nuevo;
      });
      console.error('Error al actualizar favoritos:', err.message);
      toastError('No pudimos actualizar tus favoritos');
    }
  }

  const valor = { favoritos, esFavorito, toggleFavorito, recargar: cargarFavoritos };

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) {
    throw new Error('useFavoritos debe usarse dentro de <FavoritosProvider>');
  }
  return contexto;
}