import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import Loader from '../components/UI/Loader';
import { useTasks } from '../hooks/useTasks';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamation, HiOutlineCollection } from 'react-icons/hi';
import './Analytics.css';

const Analytics = () => {
  const { tasks, loading, stats, categories, updateFilters } = useTasks();

  const s = stats?.stats || { total: 0, completed: 0, pending: 0, overdue: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0 };
  const catStats = stats?.categoryStats || [];

  // Completion percentage
  const completionPct = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;

  // Priority breakdown for bar chart
  const priorityData = useMemo(() => [
    { label: 'High', count: s.highPriority, color: 'var(--priority-high)', bg: 'var(--priority-high-bg)' },
    { label: 'Medium', count: s.mediumPriority, color: 'var(--priority-medium)', bg: 'var(--priority-medium-bg)' },
    { label: 'Low', count: s.lowPriority, color: 'var(--priority-low)', bg: 'var(--priority-low-bg)' },
  ], [s]);

  const maxPriority = Math.max(...priorityData.map((p) => p.count), 1);

  // Recent activity: tasks sorted by updatedAt
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar
        categories={categories}
        activeCategory=""
        onCategorySelect={(cat) => updateFilters({ category: cat })}
        stats={stats}
        onNewTask={() => {}}
      />

      <main className="main-content">
        <div className="page-container">
          <h1 className="dashboard-title" style={{ marginBottom: 'var(--space-xl)' }}>Analytics</h1>

          {loading ? (
            <Loader text="Loading analytics..." />
          ) : (
            <>
              {/* Stat Cards */}
              <div className="analytics-cards">
                <motion.div className="analytics-card glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                  <div className="analytics-card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <HiOutlineCollection size={22} />
                  </div>
                  <div className="analytics-card-info">
                    <span className="analytics-card-value">{s.total}</span>
                    <span className="analytics-card-label">Total Tasks</span>
                  </div>
                </motion.div>

                <motion.div className="analytics-card glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <div className="analytics-card-icon" style={{ background: 'rgba(72,199,116,0.15)', color: 'var(--success)' }}>
                    <HiOutlineCheckCircle size={22} />
                  </div>
                  <div className="analytics-card-info">
                    <span className="analytics-card-value">{s.completed}</span>
                    <span className="analytics-card-label">Completed</span>
                  </div>
                </motion.div>

                <motion.div className="analytics-card glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="analytics-card-icon" style={{ background: 'rgba(254,202,87,0.15)', color: 'var(--warning)' }}>
                    <HiOutlineClock size={22} />
                  </div>
                  <div className="analytics-card-info">
                    <span className="analytics-card-value">{s.pending}</span>
                    <span className="analytics-card-label">Pending</span>
                  </div>
                </motion.div>

                <motion.div className="analytics-card glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <div className="analytics-card-icon" style={{ background: 'rgba(255,107,107,0.15)', color: 'var(--danger)' }}>
                    <HiOutlineExclamation size={22} />
                  </div>
                  <div className="analytics-card-info">
                    <span className="analytics-card-value">{s.overdue}</span>
                    <span className="analytics-card-label">Overdue</span>
                  </div>
                </motion.div>
              </div>

              <div className="analytics-grid">
                {/* Completion Ring */}
                <motion.div className="analytics-panel glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="panel-title">Completion Rate</h3>
                  <div className="ring-container">
                    <svg viewBox="0 0 120 120" className="ring-svg">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                      <circle
                        cx="60" cy="60" r="50" fill="none"
                        stroke="url(#ring-grad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${completionPct * 3.14} 314`}
                        transform="rotate(-90 60 60)"
                        className="ring-progress"
                      />
                      <defs>
                        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="ring-label">
                      <span className="ring-pct">{completionPct}%</span>
                      <span className="ring-sub">completed</span>
                    </div>
                  </div>
                </motion.div>

                {/* Priority Breakdown */}
                <motion.div className="analytics-panel glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h3 className="panel-title">Priority Breakdown</h3>
                  <div className="bar-chart">
                    {priorityData.map((p) => (
                      <div key={p.label} className="bar-row">
                        <span className="bar-label" style={{ color: p.color }}>{p.label}</span>
                        <div className="bar-track">
                          <motion.div
                            className="bar-fill"
                            style={{ background: p.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.count / maxPriority) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          />
                        </div>
                        <span className="bar-count">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div className="analytics-panel glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h3 className="panel-title">Categories</h3>
                  {catStats.length === 0 ? (
                    <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem' }}>No category data yet.</p>
                  ) : (
                    <div className="cat-chart">
                      {catStats.map((cat) => {
                        const pct = s.total > 0 ? Math.round((cat.count / s.total) * 100) : 0;
                        const completedPct = cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0;
                        return (
                          <div key={cat._id} className="cat-row">
                            <div className="cat-row-header">
                              <span className="cat-row-name">{cat._id}</span>
                              <span className="cat-row-pct">{pct}% · {cat.count} tasks</span>
                            </div>
                            <div className="bar-track">
                              <motion.div
                                className="bar-fill"
                                style={{ background: 'var(--accent)' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                              />
                            </div>
                            <span className="cat-row-done">{completedPct}% done</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div className="analytics-panel glass" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <h3 className="panel-title">Recent Activity</h3>
                  {recentTasks.length === 0 ? (
                    <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem' }}>No recent activity.</p>
                  ) : (
                    <div className="recent-list">
                      {recentTasks.map((task) => (
                        <div key={task._id} className="recent-item">
                          <div className={`recent-dot ${task.completed ? 'done' : ''}`} />
                          <div className="recent-info">
                            <span className="recent-title">{task.title}</span>
                            <span className="recent-meta">
                              <span className={`badge badge-${task.priority}`} style={{ fontSize: '0.5625rem' }}>{task.priority}</span>
                              {task.completed ? 'Completed' : 'Active'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
