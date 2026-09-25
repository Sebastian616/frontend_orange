import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { olvidePassword } from '../api/auth';
import './AuthPages.css';

export default function OlvidePassword() {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // El backend responde igual exista o no el correo (por seguridad,
      // para no revelar qué correos están registrados), así que siempre
      // mostramos el mismo mensaje de éxito.
      await olvidePassword({ correo });
      setEnviado(true);
    } catch (err) {
      setError(err.message || 'No pudimos procesar tu solicitud');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-page__tarjeta">
          {enviado ? (
            <>
              <MailCheck size={40} strokeWidth={1.3} style={{ color: 'var(--color-marron-oscuro)', marginBottom: 12 }} />
              <h1>Revisa tu correo</h1>
              <p className="auth-page__subtitulo">
                Si <strong>{correo}</strong> está registrado, te enviamos un enlace para elegir una nueva contraseña.
                El enlace expira en 1 hora.
              </p>
              <div className="auth-page__enlaces">
                <p><Link to="/login">Volver a iniciar sesión</Link></p>
              </div>
            </>
          ) : (
            <>
              <h1>¿Olvidaste tu contraseña?</h1>
              <p className="auth-page__subtitulo">
                Escribe tu correo y te enviamos un enlace para restablecerla.
              </p>

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

                {error && <p className="auth-page__error">{error}</p>}

                <button type="submit" className="boton-primario" disabled={cargando}>
                  {cargando ? 'Enviando...' : 'Enviar enlace'}
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