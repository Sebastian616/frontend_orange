import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/Authcontext';
import './AuthPages.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const destinoDespuesDeLogin = location.state?.from || '/';

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login({ correo, password });
      navigate(destinoDespuesDeLogin, { replace: true });
    } catch (err) {
      setError(err.message || 'No pudimos iniciar sesión');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-page__tarjeta">
          <h1>Bienvenida de nuevo</h1>
          <p className="auth-page__subtitulo">Inicia sesión para seguir comprando</p>

          <form className="auth-page__formulario" onSubmit={manejarSubmit}>
            <label>
              Correo
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            {error && <p className="auth-page__error">{error}</p>}

            <button type="submit" className="boton-primario" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-page__enlaces">
            <Link to="/olvide-password">¿Olvidaste tu contraseña?</Link>
            <p>
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}