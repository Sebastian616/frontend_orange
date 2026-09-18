import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Citrus, Menu, X, Search, Heart, User, ShoppingCart, LogOut } from 'lucide-react';
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
  const { estaAutenticado, usuario, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();

  function manejarLogout() {
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
          <button className="navbar__icono" aria-label="Buscar">
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button className="navbar__icono" aria-label="Favoritos">
            <Heart size={20} strokeWidth={1.8} />
          </button>

          {estaAutenticado ? (
            <>
              <Link to="/pedidos" className="navbar__saludo" title={usuario?.correo}>
                Hola, {usuario?.nombre?.split(' ')[0]}
              </Link>
              <button className="navbar__icono" aria-label="Cerrar sesión" onClick={manejarLogout}>
                <LogOut size={20} strokeWidth={1.8} />
              </button>
            </>
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