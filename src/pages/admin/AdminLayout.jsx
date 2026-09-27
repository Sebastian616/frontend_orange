import { NavLink, Outlet } from 'react-router-dom';
import { Package, ClipboardList } from 'lucide-react';
import Navbar from '../../components/Navbar';
import CampanaPedidos from '../../components/admin/CampanaPedidos';
import { PedidosNotificacionesProvider } from '../../context/PedidosNotificacionesContext';
import './Admin.css';

export default function AdminLayout() {
  return (
    <PedidosNotificacionesProvider>
      <Navbar />
      <div className="contenedor admin-layout">
        <aside className="admin-layout__sidebar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2>Panel admin</h2>
            <CampanaPedidos />
          </div>
          <nav>
            <NavLink to="/admin/productos" className={({ isActive }) => isActive ? 'admin-layout__activo' : ''}>
              <Package size={18} strokeWidth={1.8} />
              Productos
            </NavLink>
            <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? 'admin-layout__activo' : ''}>
              <ClipboardList size={18} strokeWidth={1.8} />
              Pedidos
            </NavLink>
          </nav>
        </aside>

        <div className="admin-layout__contenido">
          <Outlet />
        </div>
      </div>
    </PedidosNotificacionesProvider>
  );
}