import { Link } from 'react-router-dom';
import { Citrus, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';
// import Logo from '../utils/logo.png'

const ENLACES_TIENDA = [
    { label: 'Tienda', href: '/tienda' },
    { label: 'Categorías', href: '/categorias' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Contacto', href: 'https://wa.me/3114163706' },
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
                            {/* <img src=3{Logo} size={24} strokeWidth={2} /> */}
                            <span>Orange</span>
                        </Link>
                        <p className="footer__descripcion">
                            Tu mejor eleccion en ropa deportiva
                        </p>
                        <div className="footer__redes">
                            <a href="https://www.facebook.com/orangestoreforyou/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                                <Facebook size={18} strokeWidth={1.8} />
                            </a>
                            <a href="https://www.instagram.com/orangestoreforyou" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                                <Instagram size={18} strokeWidth={1.8} />
                            </a>
                            {/* pendiente agregar tik tok */}
                            <a href="#" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.6 5.82c-1.02-.9-1.6-2.2-1.6-3.6h-3.4v14.2c0 1.7-1.38 3.08-3.08 3.08s-3.08-1.38-3.08-3.08 1.38-3.08 3.08-3.08c.34 0 .66.06.96.16V9.9c-.32-.04-.64-.07-.96-.07-3.6 0-6.5 2.9-6.5 6.5s2.9 6.5 6.5 6.5 6.5-2.9 6.5-6.5V9.4c1.38 1 3.08 1.6 4.9 1.6V7.6c-1.02 0-1.98-.36-2.72-.98-.2-.16-.4-.34-.6-.8z" transform="translate(1)" />
                                </svg>
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
                                <span>carrera 49 #127 sur-49 Caldas, Antioquia</span>
                            </li>
                            <li>
                                <Phone size={16} strokeWidth={1.8} />
                                <span>+57 311 416 3707</span>
                            </li>
                            <li>
                                <Mail size={16} strokeWidth={1.8} />
                                <span>contacto@stororange.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__linea" />

                <div className="footer__inferior">
                    <p>&copy; {anioActual} Orange Store for you. Todos los derechos reservados.</p>
                    <div className="footer__legal">
                        {/* <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}