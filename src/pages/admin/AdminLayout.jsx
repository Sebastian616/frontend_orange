import { NavLink, Outlet } from 'react-router-dom';
import { Package, ClipboardList } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Admin.css';

export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="contenedor admin-layout">
        <aside className="admin-layout__sidebar">
          <h2>Panel admin</h2>
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
    </>
  );
}