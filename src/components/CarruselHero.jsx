import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { obtenerFotosCarrusel } from '../api/carrusel';
import './CarruselHero.css';

const INTERVALO_MS = 4500;
const MAX_PUNTOS = 10; // con más fotos que esto, solo se muestran las flechas

// Fisher-Yates: deja las fotos en orden aleatorio
function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function CarruselHero() {
  const [fotos, setFotos] = useState([]);
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Si la persona pidió "reducir movimiento" en su sistema, no avanza solo
  const [reducirMovimiento] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );

  useEffect(() => {
    let cancelado = false;
    obtenerFotosCarrusel()
      .then((lista) => {
        if (!cancelado) setFotos(mezclar(lista));
      })
      .catch(() => {}); // si falla, se queda el fondo degradado
    return () => {
      cancelado = true;
    };
  }, []);

  const total = fotos.length;

  // Si se quitó alguna foto rota y el índice quedó fuera de rango, vuelve al inicio
  useEffect(() => {
    if (total > 0 && indice >= total) setIndice(0);
  }, [total, indice]);

  // Avance automático. Al depender de `indice`, si navegas a mano el
  // conteo de tiempo se reinicia en vez de saltar enseguida.
  useEffect(() => {
    if (total < 2 || pausado || reducirMovimiento) return undefined;
    const id = setTimeout(() => setIndice((i) => (i + 1) % total), INTERVALO_MS);
    return () => clearTimeout(id);
  }, [total, pausado, reducirMovimiento, indice]);

  function irA(n) {
    if (total === 0) return;
    setIndice(((n % total) + total) % total);
  }

  function quitarFotoRota(foto) {
    setFotos((lista) => lista.filter((f) => f !== foto));
  }

  // Solo se montan la foto actual, la anterior (para el fundido) y la
  // siguiente (precargada). Así no se descargan todas las fotos a la vez.
  const visibles = new Set(
    total > 0 ? [indice, (indice + 1) % total, (indice - 1 + total) % total] : []
  );

  return (
    <div
      className="carrusel-hero"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotos de nuestros productos"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {fotos.map((foto, i) => {
        if (!visibles.has(i)) return null;
        const activa = i === indice;

        return (
          <Link
            key={`${foto.productoId}-${i}`}
            to={`/productos/${foto.productoId}`}
            className={`carrusel-hero__slide ${activa ? 'carrusel-hero__slide--activa' : ''}`}
            aria-hidden={!activa}
            tabIndex={activa ? 0 : -1}
          >
            <img
              src={foto.url}
              alt={activa ? foto.nombre : ''}
              onError={() => quitarFotoRota(foto)}
            />
          </Link>
        );
      })}

      {total > 1 && (
        <>
          <button
            className="carrusel-hero__flecha carrusel-hero__flecha--izq"
            onClick={() => irA(indice - 1)}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
          <button
            className="carrusel-hero__flecha carrusel-hero__flecha--der"
            onClick={() => irA(indice + 1)}
            aria-label="Foto siguiente"
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>

          {total <= MAX_PUNTOS && (
            <div className="carrusel-hero__puntos">
              {fotos.map((foto, i) => (
                <button
                  key={`${foto.productoId}-punto-${i}`}
                  className={`carrusel-hero__punto ${i === indice ? 'carrusel-hero__punto--activo' : ''}`}
                  onClick={() => irA(i)}
                  aria-label={`Ir a la foto ${i + 1}`}
                  aria-current={i === indice}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}