import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { resetearPassword } from '../api/auth';
import './AuthPages.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await resetearPassword({ token, password });
      setListo(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'No pudimos restablecer tu contraseña');
    } finally {
      setCargando(false);
    }
  }

  // Sin token en la URL: el link está mal formado o incompleto
  if (!token) {
    return (
      <>
        <Navbar />
        <main className="auth-page">
          <div className="auth-page__tarjeta">
            <h1>Enlace inválido</h1>
            <p className="auth-page__subtitulo">
              Este enlace no incluye un token válido. Pide uno nuevo desde "¿Olvidaste tu contraseña?".
            </p>
            <div className="auth-page__enlaces">
              <p><Link to="/olvide-password">Solicitar un nuevo enlace</Link></p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (listo) {
    return (
      <>
        <Navbar />
        <main className="auth-page">
          <div className="auth-page__tarjeta">
            <CheckCircle2 size={40} strokeWidth={1.3} style={{ color: 'var(--color-marron-oscuro)', marginBottom: 12 }} />
            <h1>¡Contraseña actualizada!</h1>
            <p className="auth-page__subtitulo">Ya puedes iniciar sesión con tu nueva contraseña. Te llevamos al login...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-page__tarjeta">
          <h1>Elige una nueva contraseña</h1>
          <p className="auth-page__subtitulo">Este enlace expira 1 hora después de haberlo solicitado.</p>

          <form className="auth-page__formulario" onSubmit={manejarSubmit}>
            <label>
              Nueva contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirmar contraseña
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>

            {error && <p className="auth-page__error">{error}</p>}

            <button type="submit" className="boton-primario" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}