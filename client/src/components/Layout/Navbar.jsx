import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';
import { HiOutlineSun, HiOutlineMoon, HiOutlineLogout, HiOutlineCalendar, HiOutlineViewGrid, HiOutlineViewBoards, HiOutlineChartBar } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-strong">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <svg width="28" height="28" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="nav-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C5CE7"/>
                <stop offset="100%" stopColor="#00D2D3"/>
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="url(#nav-g)"/>
            <path d="M18 33l8 8 20-20" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="navbar-brand gradient-text">TaskFlow</span>
        </div>
      </div>

      <div className="navbar-center">
        <button
          className={`navbar-nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
          id="nav-dashboard"
        >
          <HiOutlineViewGrid size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`navbar-nav-btn ${location.pathname === '/calendar' ? 'active' : ''}`}
          onClick={() => navigate('/calendar')}
          id="nav-calendar"
        >
          <HiOutlineCalendar size={18} />
          <span>Calendar</span>
        </button>
        <button
          className={`navbar-nav-btn ${location.pathname === '/kanban' ? 'active' : ''}`}
          onClick={() => navigate('/kanban')}
          id="nav-kanban"
        >
          <HiOutlineViewBoards size={18} />
          <span>Kanban</span>
        </button>
        <button
          className={`navbar-nav-btn ${location.pathname === '/analytics' ? 'active' : ''}`}
          onClick={() => navigate('/analytics')}
          id="nav-analytics"
        >
          <HiOutlineChartBar size={18} />
          <span>Analytics</span>
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>

        <div className="navbar-user">
          <div className="navbar-avatar">{getInitials(user?.name)}</div>
          <span className="navbar-username">{user?.name}</span>
        </div>

        <button
          className="btn-icon"
          onClick={handleLogout}
          aria-label="Logout"
          id="logout-btn"
        >
          <HiOutlineLogout size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
