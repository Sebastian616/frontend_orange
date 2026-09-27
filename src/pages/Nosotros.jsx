import { Link } from 'react-router-dom';
import { Leaf, Heart, Truck, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Nosotros.css';

const VALORES = [
  {
    Icono: Leaf,
    titulo: 'Materiales conscientes',
    texto: 'Elegimos telas duraderas y cómodas, pensadas para acompañarte en cada entrenamiento y en el día a día.',
  },
  {
    Icono: Heart,
    titulo: 'Diseñado para ti',
    texto: 'Cada prenda está pensada para el cuerpo real de quien la usa: comodidad, movimiento libre y buen ajuste.',
  },
  {
    Icono: Truck,
    titulo: 'Envíos a todo el país',
    texto: 'Llevamos tu pedido hasta la puerta de tu casa, sin importar en qué ciudad estés.',
  },
  {
    Icono: ShieldCheck,
    titulo: 'Compra segura',
    texto: 'Tus datos y tus pagos están protegidos en cada paso del proceso.',
  },
];

export default function Nosotros() {
  return (
    <>
      <Navbar />
      <main className="nosotros">
        <section className="nosotros__hero">
          <div className="contenedor nosotros__hero-contenido">
            <p className="nosotros__eyebrow">Nuestra historia</p>
            <h1>Ropa deportiva que se mueve contigo</h1>
            <p className="nosotros__hero-texto">
              Orange nace de una idea simple: la ropa deportiva para dama debería sentirse tan bien como se ve.
              Creamos piezas cómodas, duraderas y con estilo, para que te sientas segura en cada movimiento —
              ya sea en el gimnasio, en la calle o en un día tranquilo en casa.
            </p>
          </div>
        </section>

        <section className="contenedor nosotros__valores">
          <h2>Lo que nos mueve</h2>
          <div className="nosotros__valores-grid">
            {VALORES.map(({ Icono, titulo, texto }) => (
              <div key={titulo} className="nosotros__valor">
                <div className="nosotros__valor-icono">
                  <Icono size={24} strokeWidth={1.6} />
                </div>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="nosotros__cta">
          <div className="contenedor nosotros__cta-contenido">
            <h2>¿Lista para encontrar tu próxima prenda favorita?</h2>
            <Link to="/tienda" className="boton-primario">Explorar tienda</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}