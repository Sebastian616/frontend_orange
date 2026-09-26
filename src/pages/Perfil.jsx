import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, MailWarning } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { obtenerMiPerfil, actualizarMiPerfil, reenviarVerificacion } from '../api/usuarios';
import { alertaError, toastExito } from '../utils/alertas';
import './Perfil.css';

export default function Perfil() {
  const { estaAutenticado, token, actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/perfil' } });
      return;
    }

    obtenerMiPerfil(token)
      .then((data) => {
        setPerfil(data);
        setNombre(data.nombre);
        setWhatsapp(data.whatsapp);
      })
      .catch(() => alertaError('No pudimos cargar tu perfil'))
      .finally(() => setCargando(false));
  }, [estaAutenticado, token, navigate]);

  async function manejarSubmit(e) {
    e.preventDefault();
    setGuardando(true);

    try {
      const actualizado = await actualizarMiPerfil({ nombre, whatsapp }, token);
      setPerfil(actualizado);
      actualizarUsuario({ nombre: actualizado.nombre, whatsapp: actualizado.whatsapp });
      toastExito('Perfil actualizado');
    } catch (err) {
      alertaError(err.message || 'No pudimos actualizar tu perfil');
    } finally {
      setGuardando(false);
    }
  }

  async function manejarReenviarVerificacion() {
    setReenviando(true);
    try {
      await reenviarVerificacion(token);
      toastExito('Te reenviamos el correo de verificación');
    } catch (err) {
      alertaError(err.message || 'No pudimos reenviar la verificación');
    } finally {
      setReenviando(false);
    }
  }

  if (cargando) {
    return (
      <>
        <Navbar />
        <main className="contenedor perfil__estado">Cargando tu perfil...</main>
      </>
    );
  }

  if (!perfil) return null;

  return (
    <>
      <Navbar />
      <main className="contenedor perfil">
        <h1>Mi perfil</h1>

        <div className="perfil__layout">
          <form className="perfil__formulario" onSubmit={manejarSubmit}>
            <h2>Datos personales</h2>

            <label>
              Correo
              <input type="email" value={perfil.correo} disabled />
            </label>

            <label>
              Nombre
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </label>

            <label>
              WhatsApp
              <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
            </label>

            <button type="submit" className="boton-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>

          <div className="perfil__lateral">
            <div className="perfil__tarjeta">
              <h2>Verificación de correo</h2>
              {perfil.correo_verificado ? (
                <p className="perfil__verificado">
                  <BadgeCheck size={18} strokeWidth={1.8} />
                  Tu correo está verificado
                </p>
              ) : (
                <>
                  <p className="perfil__no-verificado">
                    <MailWarning size={18} strokeWidth={1.8} />
                    Tu correo aún no está verificado
                  </p>
                  <button
                    className="boton-secundario"
                    onClick={manejarReenviarVerificacion}
                    disabled={reenviando}
                  >
                    {reenviando ? 'Enviando...' : 'Reenviar correo de verificación'}
                  </button>
                </>
              )}
            </div>

            <div className="perfil__tarjeta">
              <h2>Cuenta</h2>
              <p className="perfil__dato"><strong>Rol:</strong> {perfil.rol}</p>
              <p className="perfil__dato">
                <strong>Miembro desde:</strong>{' '}
                {new Date(perfil.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}