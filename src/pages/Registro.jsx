import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', correo: '', whatsapp: '', password: '', confirmar: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  function actualizarCampo(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      await registrar(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'No pudimos crear tu cuenta');
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-page__tarjeta">
          <h1>Crea tu cuenta</h1>
          <p className="auth-page__subtitulo">Únete y descubre la colección Orange</p>

          <form className="auth-page__formulario" onSubmit={manejarSubmit}>
            <label>
              Nombre
              <input type="text" value={form.nombre} onChange={actualizarCampo('nombre')} required />
            </label>

            <label>
              Correo
              <input type="email" value={form.correo} onChange={actualizarCampo('correo')} required autoComplete="email" />
            </label>

            <label>
              WhatsApp
              <input type="tel" value={form.whatsapp} onChange={actualizarCampo('whatsapp')} required placeholder="3001234567" />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={form.password}
                onChange={actualizarCampo('password')}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirmar contraseña
              <input
                type="password"
                value={form.confirmar}
                onChange={actualizarCampo('confirmar')}
                required
                autoComplete="new-password"
              />
            </label>

            {error && <p className="auth-page__error">{error}</p>}

            <button type="submit" className="boton-primario" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-page__enlaces">
            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}