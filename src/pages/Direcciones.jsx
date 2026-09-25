import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/Authcontext';
import { obtenerDirecciones, crearDireccion, actualizarDireccion, eliminarDireccion } from '../api/direcciones';
import { alertaConfirmar, alertaError, toastExito } from '../utils/alertas';
import './Direcciones.css';

const FORM_VACIO = { alias: '', direccion: '', ciudad: '', departamento: '', referencia: '' };

export default function Direcciones() {
  const { estaAutenticado, token } = useAuth();
  const navigate = useNavigate();

  const [direcciones, setDirecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!estaAutenticado) {
      navigate('/login', { state: { from: '/direcciones' } });
      return;
    }
    cargar();
  }, [estaAutenticado]);

  function cargar() {
    obtenerDirecciones(token)
      .then(setDirecciones)
      .catch(() => alertaError('No pudimos cargar tus direcciones'))
      .finally(() => setCargando(false));
  }

  function actualizarCampo(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  function empezarEdicion(direccion) {
    setEditandoId(direccion.id);
    setForm({
      alias: direccion.alias,
      direccion: direccion.direccion,
      ciudad: direccion.ciudad,
      departamento: direccion.departamento || '',
      referencia: direccion.referencia || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORM_VACIO);
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setGuardando(true);

    try {
      if (editandoId) {
        await actualizarDireccion(editandoId, form, token);
        toastExito('Dirección actualizada');
      } else {
        await crearDireccion(form, token);
        toastExito('Dirección agregada');
      }
      setForm(FORM_VACIO);
      setEditandoId(null);
      cargar();
    } catch (err) {
      alertaError(err.message || 'No pudimos guardar la dirección');
    } finally {
      setGuardando(false);
    }
  }

  async function manejarEliminar(direccion) {
    const confirmado = await alertaConfirmar(
      `Vas a eliminar la dirección "${direccion.alias}". Esta acción no se puede deshacer.`,
      '¿Eliminar dirección?'
    );
    if (!confirmado) return;

    try {
      await eliminarDireccion(direccion.id, token);
      toastExito('Dirección eliminada');
      cargar();
    } catch (err) {
      alertaError(err.message || 'No pudimos eliminar la dirección');
    }
  }

  return (
    <>
      <Navbar />
      <main className="contenedor direcciones">
        <h1>Mis direcciones</h1>

        <div className="direcciones__layout">
          <form className="direcciones__formulario" onSubmit={manejarSubmit}>
            <h2>{editandoId ? 'Editar dirección' : 'Agregar dirección'}</h2>

            <label>
              Alias
              <input
                type="text"
                placeholder="Casa, Trabajo..."
                value={form.alias}
                onChange={actualizarCampo('alias')}
                required
              />
            </label>

            <label>
              Dirección
              <input
                type="text"
                placeholder="Calle 10 # 20-30"
                value={form.direccion}
                onChange={actualizarCampo('direccion')}
                required
              />
            </label>

            <label>
              Ciudad
              <input type="text" value={form.ciudad} onChange={actualizarCampo('ciudad')} required />
            </label>

            <label>
              Departamento
              <input type="text" value={form.departamento} onChange={actualizarCampo('departamento')} />
            </label>

            <label>
              Referencia (opcional)
              <input
                type="text"
                placeholder="Apto, torre, punto de referencia..."
                value={form.referencia}
                onChange={actualizarCampo('referencia')}
              />
            </label>

            <div className="direcciones__acciones-form">
              <button type="submit" className="boton-primario" disabled={guardando}>
                {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Agregar dirección'}
              </button>
              {editandoId && (
                <button type="button" className="boton-secundario" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="direcciones__lista">
            {cargando && <p className="direcciones__estado">Cargando...</p>}

            {!cargando && direcciones.length === 0 && (
              <div className="direcciones__vacio">
                <MapPin size={32} strokeWidth={1.3} />
                <p>Todavía no tienes direcciones guardadas.</p>
              </div>
            )}

            {direcciones.map((d) => (
              <div key={d.id} className="direcciones__tarjeta">
                <div className="direcciones__tarjeta-info">
                  <p className="direcciones__alias">{d.alias}</p>
                  <p>{d.direccion}</p>
                  <p>{d.ciudad}{d.departamento ? `, ${d.departamento}` : ''}</p>
                  {d.referencia && <p className="direcciones__referencia">{d.referencia}</p>}
                </div>
                <div className="direcciones__tarjeta-acciones">
                  <button onClick={() => empezarEdicion(d)} aria-label={`Editar ${d.alias}`}>
                    <Pencil size={16} strokeWidth={1.8} />
                  </button>
                  <button onClick={() => manejarEliminar(d)} aria-label={`Eliminar ${d.alias}`}>
                    <Trash2 size={16} strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}