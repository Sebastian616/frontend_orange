import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Envuelve rutas que solo debe poder ver un usuario con rol ADMIN.
// Si no hay sesión, manda a login. Si hay sesión pero no es admin,
// manda a la Home (sin dar pistas de que existe un panel admin).
export default function RutaAdmin({ children }) {
  const { estaAutenticado, usuario } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  if (usuario?.rol !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}