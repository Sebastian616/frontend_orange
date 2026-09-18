import { createContext, useContext, useState } from 'react';
import { loginUsuario, registrarUsuario } from '../api/auth';

const AuthContext = createContext(null);
const CLAVE_STORAGE = 'orange_auth';

function leerSesionGuardada() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    return guardado ? JSON.parse(guardado) : { usuario: null, token: null };
  } catch {
    return { usuario: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);

  function guardarSesion(usuario, token) {
    const nueva = { usuario, token };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nueva));
    setSesion(nueva);
  }

  async function login({ correo, password }) {
    const data = await loginUsuario({ correo, password });
    guardarSesion(data.usuario, data.token);
    return data.usuario;
  }

  async function registrar({ nombre, correo, whatsapp, password }) {
    const data = await registrarUsuario({ nombre, correo, whatsapp, password });
    guardarSesion(data.usuario, data.token);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem(CLAVE_STORAGE);
    setSesion({ usuario: null, token: null });
  }

  const valor = {
    usuario: sesion.usuario,
    token: sesion.token,
    estaAutenticado: Boolean(sesion.token),
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return contexto;
}