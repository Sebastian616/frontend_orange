import Swal from 'sweetalert2';

// Instancia base de SweetAlert2 con la identidad visual de Orange:
// tipografías (Playfair Display / Montserrat), paleta de colores y
// botones redondeados iguales a los del resto del sitio.
const alertaBase = Swal.mixin({
  confirmButtonColor: '#8B5D33', // --color-marron-oscuro
  cancelButtonColor: '#869D7A', // --color-verde-oliva
  color: '#2B2B24', // --color-texto-principal
  background: '#FFFFFF',
  confirmButtonText: 'Entendido',
  buttonsStyling: false,
  customClass: {
    popup: 'orange-alerta',
    title: 'orange-alerta__titulo',
    confirmButton: 'orange-alerta__boton orange-alerta__boton--primario',
    cancelButton: 'orange-alerta__boton orange-alerta__boton--secundario',
  },
});

export function alertaExito(mensaje, titulo = '¡Listo!') {
  return alertaBase.fire({ icon: 'success', title: titulo, text: mensaje });
}

export function alertaError(mensaje, titulo = 'Algo salió mal') {
  return alertaBase.fire({ icon: 'error', title: titulo, text: mensaje });
}

export function alertaAviso(mensaje, titulo = 'Un momento') {
  return alertaBase.fire({ icon: 'warning', title: titulo, text: mensaje });
}

export function alertaConfirmar(mensaje, titulo = '¿Estás segura?') {
  return alertaBase
    .fire({
      icon: 'question',
      title: titulo,
      text: mensaje,
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    })
    .then((resultado) => resultado.isConfirmed);
}

// Toast pequeño (esquina superior), para confirmaciones rápidas que no
// necesitan interrumpir a la persona (ej: "agregado al carrito").
export function toastExito(mensaje) {
  return alertaBase.fire({
    icon: 'success',
    title: mensaje,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}

export function toastError(mensaje) {
  return alertaBase.fire({
    icon: 'error',
    title: mensaje,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
}