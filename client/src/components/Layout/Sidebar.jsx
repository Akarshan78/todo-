import { HiOutlineCollection, HiOutlineTag, HiPlus } from 'react-icons/hi';
import { DEFAULT_CATEGORIES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ categories = [], activeCategory, onCategorySelect, stats, onNewTask }) => {
  // Merge API categories with defaults (unique)
  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])].sort();

  return (
    <aside className="sidebar glass-strong">
      <div className="sidebar-section">
        <button className="btn btn-primary btn-full btn-lg" onClick={onNewTask} id="new-task-btn">
          <HiPlus size={18} />
          New Task
        </button>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">
          <HiOutlineCollection size={16} />
          Overview
        </h3>
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-value">{stats?.stats?.total || 0}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-completed">{stats?.stats?.completed || 0}</span>
            <span className="stat-label">Done</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-pending">{stats?.stats?.pending || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-value stat-overdue">{stats?.stats?.overdue || 0}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-heading">
          <HiOutlineTag size={16} />
          Categories
        </h3>
        <ul className="sidebar-categories">
          <li>
            <button
              className={`sidebar-cat-btn ${activeCategory === '' ? 'active' : ''}`}
              onClick={() => onCategorySelect('')}
            >
              <span className="cat-dot" style={{ background: 'var(--primary)' }} />
              All Tasks
              {stats?.stats && (
                <span className="cat-count">{stats.stats.total}</span>
              )}
            </button>
          </li>
          {allCategories.map((cat) => {
            const catStat = stats?.categoryStats?.find((c) => c._id === cat);
            return (
              <li key={cat}>
                <button
                  className={`sidebar-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => onCategorySelect(cat)}
                >
                  <span className="cat-dot" style={{ background: 'var(--accent)' }} />
                  {cat}
                  {catStat && <span className="cat-count">{catStat.count}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
