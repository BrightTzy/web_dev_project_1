import { Outlet, NavLink } from 'react-router-dom';
import { KanbanSquare, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <KanbanSquare size={28} color="var(--primary-color)" />
          <h1>Kanban</h1>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <KanbanSquare size={20} />
            <span>Kanban Board</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </nav>

        <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Kanban Project &copy; 2026
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
