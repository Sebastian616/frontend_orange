import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/Authcontext';
import { FavoritosProvider } from './context/FavoritosContext';
import { CartProvider } from './context/CartContext';
import RutaAdmin from './components/RutaAdmin';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import Direcciones from './pages/Direcciones';
import Login from './pages/Login';
import Registro from './pages/Registro';
import OlvidePassword from './pages/OlvidePassword';
import ResetPassword from './pages/ResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <FavoritosProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/pedidos" element={<MisPedidos />} />
              <Route path="/direcciones" element={<Direcciones />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/olvide-password" element={<OlvidePassword />} />
              <Route path="/resetear-password" element={<ResetPassword />} />

              <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
                <Route index element={<Navigate to="productos" replace />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="pedidos" element={<AdminPedidos />} />
              </Route>
            </Routes>
          </CartProvider>
        </FavoritosProvider>
      </HashRouter>
    </AuthProvider>
  );
}