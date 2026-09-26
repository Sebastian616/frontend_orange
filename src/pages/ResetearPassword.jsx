import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { resetearPassword } from '../api/auth';
import './AuthPages.css';

export default function ResetearPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extrae el ?token= de la URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [completado, setCompletado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('El enlace no es válido o ha expirado.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {
      await resetearPassword({ token, password });
      setCompletado(true);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña. Puede que el enlace haya expirado.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-page__tarjeta">
          {completado ? (
            <>
              <CheckCircle2 size={40} strokeWidth={1.3} style={{ color: '#2e7d32', marginBottom: 12 }} />
              <h1>¡Contraseña actualizada!</h1>
              <p className="auth-page__subtitulo">
                Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
              </p>
              <button 
                type="button" 
                className="boton-primario" 
                onClick={() => navigate('/login')}
              >
                Ir a Iniciar Sesión
              </button>
            </>
          ) : (
            <>
              <KeyRound size={40} strokeWidth={1.3} style={{ color: 'var(--color-marron-oscuro)', marginBottom: 12 }} />
              <h1>Crea una nueva contraseña</h1>
              <p className="auth-page__subtitulo">
                Ingresa tu nueva clave a continuación.
              </p>

              <form className="auth-page__formulario" onSubmit={manejarSubmit}>
                <label>
                  Nueva contraseña
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </label>

                <label>
                  Confirmar contraseña
                  <input
                    type="password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                  />
                </label>

                {error && <p className="auth-page__error">{error}</p>}

                <button type="submit" className="boton-primario" disabled={cargando}>
                  {cargando ? 'Guardando...' : 'Restablecer contraseña'}
                </button>
              </form>

              <div className="auth-page__enlaces">
                <p><Link to="/login">Volver a iniciar sesión</Link></p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}