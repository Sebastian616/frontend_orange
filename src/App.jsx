import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/favoritosContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import ProductoDetalle from './pages/productodetalle';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import Login from './pages/Login';
import Registro from './pages/Registro';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FavoritosProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/pedidos" element={<MisPedidos />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
            </Routes>
          </CartProvider>
        </FavoritosProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}