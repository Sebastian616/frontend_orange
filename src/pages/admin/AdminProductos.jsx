import { useEffect, useState } from 'react';
import { Plus, Pencil, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../../context/Authcontext';
import {
  obtenerProductosAdmin,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
  reactivarProducto,
} from '../../api/productos';
import { obtenerCategorias } from '../../api/categorias';
import { obtenerTallasCatalogo, asignarTallaProducto, actualizarStockTalla } from '../../api/productoTallas';
import { alertaError, alertaConfirmar, toastExito } from '../../utils/alertas';
import './Admin.css';

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', etiqueta: '', categoriaId: '', fotos: '' };

export default function AdminProductos() {
  const { token } = useAuth();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tallasCatalogo, setTallasCatalogo] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [stockPorTalla, setStockPorTalla] = useState({}); // { tallaId: stock }
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([obtenerProductosAdmin(token), obtenerCategorias(), obtenerTallasCatalogo()])
      .then(([prods, cats, tallas]) => {
        setProductos(prods);
        setCategorias(cats);
        setTallasCatalogo(tallas);
      })
      .catch(() => alertaError('No pudimos cargar los productos'))
      .finally(() => setCargando(false));
  }, [token]);

  function recargarLista() {
    obtenerProductosAdmin(token).then(setProductos).catch(() => {});
  }

  function actualizarCampo(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));
  }

  function abrirNuevo() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    const stockInicial = {};
    tallasCatalogo.forEach((t) => { stockInicial[t.id] = 0; });
    setStockPorTalla(stockInicial);
    setMostrarForm(true);
  }

  async function abrirEdicion(productoResumen) {
    try {
      const detalle = await obtenerProductoPorId(productoResumen.id);
      setEditandoId(detalle.id);
      setForm({
        nombre: detalle.nombre,
        descripcion: detalle.descripcion || '',
        precio: detalle.precio,
        etiqueta: detalle.etiqueta || '',
        categoriaId: detalle.categoria_id || '',
        fotos: (detalle.fotos || []).join('\n'),
      });
      const stockActual = {};
      tallasCatalogo.forEach((t) => {
        const existente = detalle.tallas?.find((dt) => dt.talla_id === t.id);
        stockActual[t.id] = existente ? existente.stock : 0;
      });
      setStockPorTalla(stockActual);
      setMostrarForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      alertaError('No pudimos cargar el producto para editar');
    }
  }

  function cerrarForm() {
    setMostrarForm(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setGuardando(true);

    const datosBase = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      etiqueta: form.etiqueta || null,
      categoriaId: form.categoriaId || null,
      fotos: form.fotos.split('\n').map((f) => f.trim()).filter(Boolean),
    };

    try {
      if (editandoId) {
        await actualizarProducto(editandoId, datosBase, token);
        // Sincroniza el stock de cada talla (ya sea que existiera o no antes)
        await Promise.all(
          tallasCatalogo.map(async (t) => {
            const stock = Number(stockPorTalla[t.id] || 0);
            try {
              await actualizarStockTalla(editandoId, t.id, { stock }, token);
            } catch {
              // si esa talla nunca se había asignado a este producto, la crea
              await asignarTallaProducto(editandoId, { tallaId: t.id, stock }, token);
            }
          })
        );
        toastExito('Producto actualizado');
      } else {
        const tallas = tallasCatalogo
          .map((t) => ({ tallaId: t.id, stock: Number(stockPorTalla[t.id] || 0) }))
          .filter((t) => t.stock > 0);
        await crearProducto({ ...datosBase, tallas }, token);
        toastExito('Producto creado');
      }
      cerrarForm();
      recargarLista();
    } catch (err) {
      alertaError(err.message || 'No pudimos guardar el producto');
    } finally {
      setGuardando(false);
    }
  }

  async function alternarActivo(producto) {
    const accion = producto.activo ? 'desactivar' : 'reactivar';
    const confirmado = await alertaConfirmar(
      `Vas a ${accion} "${producto.nombre}".`,
      `¿${accion === 'desactivar' ? 'Desactivar' : 'Reactivar'} producto?`
    );
    if (!confirmado) return;

    try {
      if (producto.activo) await desactivarProducto(producto.id, token);
      else await reactivarProducto(producto.id, token);
      toastExito(`Producto ${accion === 'desactivar' ? 'desactivado' : 'reactivado'}`);
      recargarLista();
    } catch (err) {
      alertaError(err.message || `No pudimos ${accion} el producto`);
    }
  }

  return (
    <div>
      <div className="admin-cabecera">
        <h1>Productos</h1>
        {!mostrarForm && (
          <button className="boton-primario" onClick={abrirNuevo}>
            <Plus size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Nuevo producto
          </button>
        )}
      </div>

      {mostrarForm && (
        <form className="admin-form-tarjeta" onSubmit={manejarSubmit}>
          <h2>{editandoId ? 'Editar producto' : 'Nuevo producto'}</h2>

          <div className="admin-form-fila">
            <label>
              Nombre
              <input type="text" value={form.nombre} onChange={actualizarCampo('nombre')} required />
            </label>
            <label>
              Precio
              <input type="number" min="0" value={form.precio} onChange={actualizarCampo('precio')} required />
            </label>
          </div>

          <label>
            Descripción
            <textarea value={form.descripcion} onChange={actualizarCampo('descripcion')} />
          </label>

          <div className="admin-form-fila">
            <label>
              Categoría
              <select value={form.categoriaId} onChange={actualizarCampo('categoriaId')}>
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Etiqueta
              <input type="text" placeholder="nuevo, oferta, más vendido..." value={form.etiqueta} onChange={actualizarCampo('etiqueta')} />
            </label>
          </div>

          <label>
            Fotos (una URL por línea)
            <textarea
              value={form.fotos}
              onChange={actualizarCampo('fotos')}
              placeholder="https://..."
            />
          </label>

          <label>Stock por talla</label>
          <div className="admin-tallas-grid">
            {tallasCatalogo.map((t) => (
              <label key={t.id}>
                {t.nombre}
                <input
                  type="number"
                  min="0"
                  value={stockPorTalla[t.id] ?? 0}
                  onChange={(e) => setStockPorTalla((prev) => ({ ...prev, [t.id]: e.target.value }))}
                />
              </label>
            ))}
          </div>

          <div className="admin-form-acciones">
            <button type="submit" className="boton-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button type="button" className="boton-secundario" onClick={cerrarForm}>Cancelar</button>
          </div>
        </form>
      )}

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="admin-tabla-wrap">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className={!p.activo ? 'admin-tabla__inactivo' : ''}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria_nombre || '—'}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                  <td>
                    <span className={`admin-badge ${p.activo ? 'admin-badge--activo' : 'admin-badge--inactivo'}`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="admin-tabla__acciones">
                    <button onClick={() => abrirEdicion(p)} aria-label={`Editar ${p.nombre}`}>
                      <Pencil size={15} strokeWidth={1.8} />
                    </button>
                    <button onClick={() => alternarActivo(p)} aria-label={p.activo ? `Desactivar ${p.nombre}` : `Reactivar ${p.nombre}`}>
                      {p.activo ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}