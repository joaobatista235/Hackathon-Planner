import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { Icon, type IconName } from '@/presentation/components/base/Icon/Icon';
import './Sidebar.css';

const NAV_ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: '/dashboard',      label: 'Dashboard',    icon: 'grid' },
  { to: '/classes',        label: 'Turmas',        icon: 'school' },
  { to: '/lessons',        label: 'Aulas',         icon: 'book-open' },
  { to: '/calendar',       label: 'Calendário',    icon: 'calendar' },
  { to: '/assessments',    label: 'Avaliações',    icon: 'clipboard' },
  { to: '/alerts',         label: 'Alertas',       icon: 'bell' },
  { to: '/bimester-plans', label: 'Planejamento',  icon: 'bar-chart' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark" aria-hidden="true" />
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
            <Icon name={item.icon} size={16} />
            <span className="sidebar__item-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">{initials}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name truncate">{user?.name}</span>
            <span className="sidebar__user-role">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Professor'}
            </span>
          </div>
        </div>
        <button
          className="sidebar__logout"
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair da conta"
        >
          <Icon name="log-out" size={15} />
        </button>
      </div>
    </aside>
  );
}
