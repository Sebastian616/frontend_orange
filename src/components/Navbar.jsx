import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Citrus, Menu, X, Search, Heart, User, ShoppingCart, LogOut, Package, MapPin, ChevronDown, Shield, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const ENLACES = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Categorías', href: '/categorias' },
  { label: 'Nosotros', href: '/nosotros' },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const { estaAutenticado, usuario, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();
  const cuentaRef = useRef(null);
  const busquedaRef = useRef(null);
  const inputBusquedaRef = useRef(null);

  // Cierra el menú de cuenta o el buscador si haces clic fuera de ellos
  useEffect(() => {
    function manejarClicFuera(e) {
      if (cuentaRef.current && !cuentaRef.current.contains(e.target)) {
        setCuentaAbierta(false);
      }
      if (busquedaRef.current && !busquedaRef.current.contains(e.target)) {
        setBusquedaAbierta(false);
      }
    }
    document.addEventListener('mousedown', manejarClicFuera);
    return () => document.removeEventListener('mousedown', manejarClicFuera);
  }, []);

  // Cuando se abre el buscador, le pone el foco al input automáticamente
  useEffect(() => {
    if (busquedaAbierta) inputBusquedaRef.current?.focus();
  }, [busquedaAbierta]);

  function manejarBuscar(e) {
    e.preventDefault();
    const texto = textoBusqueda.trim();
    if (!texto) return;
    navigate(`/tienda?q=${encodeURIComponent(texto)}`);
    setBusquedaAbierta(false);
    setTextoBusqueda('');
  }

  function manejarLogout() {
    setCuentaAbierta(false);
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="contenedor navbar__interior">
        <button
          className="navbar__hamburguesa"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((v) => !v)}
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="navbar__logo">
          <Citrus size={24} strokeWidth={2} />
          <span>Orange</span>
        </Link>

        <nav className={`navbar__enlaces ${menuAbierto ? 'navbar__enlaces--abierto' : ''}`}>
          {ENLACES.map((enlace) => (
            <Link key={enlace.href} to={enlace.href} className="navbar__enlace">
              {enlace.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__acciones">
          <div className="navbar__busqueda" ref={busquedaRef}>
            <button
              className="navbar__icono"
              aria-label={busquedaAbierta ? 'Cerrar búsqueda' : 'Buscar'}
              aria-expanded={busquedaAbierta}
              onClick={() => setBusquedaAbierta((v) => !v)}
            >
              {busquedaAbierta ? <X size={20} strokeWidth={1.8} /> : <Search size={20} strokeWidth={1.8} />}
            </button>

            {busquedaAbierta && (
              <form className="navbar__busqueda-panel" onSubmit={manejarBuscar}>
                <input
                  ref={inputBusquedaRef}
                  type="search"
                  placeholder="Buscar productos..."
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                />
                <button type="submit" aria-label="Buscar">
                  <Search size={16} strokeWidth={1.8} />
                </button>
              </form>
            )}
          </div>

          <button className="navbar__icono" aria-label="Favoritos">
            <Heart size={20} strokeWidth={1.8} />
          </button>

          {estaAutenticado ? (
            <div className="navbar__cuenta" ref={cuentaRef}>
              <button
                className="navbar__cuenta-boton"
                onClick={() => setCuentaAbierta((v) => !v)}
                aria-expanded={cuentaAbierta}
                aria-haspopup="true"
              >
                <span title={usuario?.correo}>Hola, {usuario?.nombre?.split(' ')[0]}</span>
                <ChevronDown size={18} className={cuentaAbierta ? 'navbar__cuenta-flecha--abierta' : ''} />
              </button>

              {cuentaAbierta && (
                <div className="navbar__cuenta-menu">
                  <Link to="/perfil" onClick={() => setCuentaAbierta(false)}>
                    <UserCircle size={16} strokeWidth={1.8} />
                    Mi perfil
                  </Link>
                  <Link to="/pedidos" onClick={() => setCuentaAbierta(false)}>
                    <Package size={16} strokeWidth={1.8} />
                    Mis pedidos
                  </Link>
                  <Link to="/direcciones" onClick={() => setCuentaAbierta(false)}>
                    <MapPin size={16} strokeWidth={1.8} />
                    Direcciones
                  </Link>
                  {usuario?.rol === 'ADMIN' && (
                    <Link to="/admin/productos" onClick={() => setCuentaAbierta(false)}>
                      <Shield size={16} strokeWidth={1.8} />
                      Panel admin
                    </Link>
                  )}
                  <button onClick={manejarLogout}>
                    <LogOut size={16} strokeWidth={1.8} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__icono" aria-label="Iniciar sesión">
              <User size={20} strokeWidth={1.8} />
            </Link>
          )}

          <Link to="/carrito" className="navbar__icono navbar__carrito" aria-label="Carrito de compras">
            <ShoppingCart size={20} strokeWidth={1.8} />
            {cantidadTotal > 0 && (
              <span className="navbar__badge">{cantidadTotal}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}