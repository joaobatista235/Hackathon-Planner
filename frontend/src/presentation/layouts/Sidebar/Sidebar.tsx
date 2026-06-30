import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',     icon: '⊞' },
  { to: '/classes',       label: 'Turmas',         icon: '🏫' },
  { to: '/lessons',       label: 'Aulas',          icon: '📖' },
  { to: '/calendar',      label: 'Calendário',     icon: '📅' },
  { to: '/assessments',   label: 'Avaliações',     icon: '📝' },
  { to: '/alerts',        label: 'Alertas',        icon: '🔔' },
  { to: '/bimester-plans',label: 'Planejamento',   icon: '📊' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon">🎓</span>
        <span className="sidebar__brand-name">Planner</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
            }
          >
            <span className="sidebar__item-icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar__item-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name truncate">{user?.name}</span>
            <span className="sidebar__user-role">{user?.role === 'ADMIN' ? 'Admin' : 'Professor'}</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout} title="Sair" aria-label="Sair">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
