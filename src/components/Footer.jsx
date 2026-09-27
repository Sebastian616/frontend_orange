import { Link } from 'react-router-dom';
import { Citrus, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const ENLACES_TIENDA = [
  { label: 'Tienda', href: '/tienda' },
  { label: 'Categorías', href: '/categorias' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

const ENLACES_CUENTA = [
  { label: 'Mi perfil', href: '/perfil' },
  { label: 'Mis pedidos', href: '/pedidos' },
  { label: 'Direcciones', href: '/direcciones' },
  { label: 'Iniciar sesión', href: '/login' },
];

export default function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor footer__interior">
        <div className="footer__grid">
          <div className="footer__marca">
            <Link to="/" className="footer__logo">
              <Citrus size={24} strokeWidth={2} />
              <span>Orange</span>
            </Link>
            <p className="footer__descripcion">
              Productos frescos y de calidad, directo a tu puerta.
            </p>
            <div className="footer__redes">
              <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={18} strokeWidth={1.8} />
              </a>
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={18} strokeWidth={1.8} />
              </a>
              <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={18} strokeWidth={1.8} />
              </a>
            </div>
          </div>

          <div className="footer__columna">
            <h3>Tienda</h3>
            <ul>
              {ENLACES_TIENDA.map((enlace) => (
                <li key={enlace.href}>
                  <Link to={enlace.href}>{enlace.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__columna">
            <h3>Mi cuenta</h3>
            <ul>
              {ENLACES_CUENTA.map((enlace) => (
                <li key={enlace.href}>
                  <Link to={enlace.href}>{enlace.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__columna">
            <h3>Contacto</h3>
            <ul className="footer__contacto">
              <li>
                <MapPin size={16} strokeWidth={1.8} />
                <span>Medellín, Colombia</span>
              </li>
              <li>
                <Phone size={16} strokeWidth={1.8} />
                <span>+57 300 000 0000</span>
              </li>
              <li>
                <Mail size={16} strokeWidth={1.8} />
                <span>contacto@orange.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__linea" />

        <div className="footer__inferior">
          <p>&copy; {anioActual} Orange. Todos los derechos reservados.</p>
          <div className="footer__legal">
            {/* <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}