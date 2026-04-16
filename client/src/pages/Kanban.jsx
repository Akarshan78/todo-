import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import TaskForm from '../components/Tasks/TaskForm';
import Loader from '../components/UI/Loader';
import EmptyState from '../components/UI/EmptyState';
import { useTasks } from '../hooks/useTasks';
import { getDueDateLabel, isOverdue } from '../utils/helpers';
import { HiOutlineClock, HiOutlineTag, HiPlus, HiOutlineTrash } from 'react-icons/hi';
import './Kanban.css';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'var(--primary)' },
  { id: 'inprogress', title: 'In Progress', color: 'var(--warning)' },
  { id: 'done', title: 'Done', color: 'var(--success)' },
];

// Map tasks to kanban columns based on completion status
// "In Progress" = has a dueDate and not completed
// "Done" = completed
// "To Do" = everything else
const getColumn = (task) => {
  if (task.completed) return 'done';
  if (task.dueDate && !task.completed) return 'inprogress';
  return 'todo';
};

const Kanban = () => {
  const {
    tasks, loading, categories, stats,
    createTask, updateTask, deleteTask, toggleTask, updateFilters,
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const getColumnTasks = (colId) => tasks.filter((t) => getColumn(t) === colId);

  // Drag & Drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colId);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = async (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);

    if (!draggedTask) return;
    const currentCol = getColumn(draggedTask);
    if (currentCol === colId) return;

    // Move task to new column
    if (colId === 'done') {
      if (!draggedTask.completed) await toggleTask(draggedTask._id);
    } else if (colId === 'inprogress') {
      const updates = {};
      if (draggedTask.completed) updates.completed = false;
      if (!draggedTask.dueDate) updates.dueDate = new Date().toISOString();
      if (Object.keys(updates).length > 0) await updateTask(draggedTask._id, updates);
    } else if (colId === 'todo') {
      const updates = {};
      if (draggedTask.completed) updates.completed = false;
      if (draggedTask.dueDate) updates.dueDate = null;
      if (Object.keys(updates).length > 0) await updateTask(draggedTask._id, updates);
    }
    setDraggedTask(null);
  };

  const handleFormSubmit = async (data) => {
    await createTask(data);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar
        categories={categories}
        activeCategory=""
        onCategorySelect={(cat) => updateFilters({ category: cat })}
        stats={stats}
        onNewTask={() => setFormOpen(true)}
      />

      <main className="main-content">
        <div className="page-container">
          <div className="kanban-header">
            <div>
              <h1 className="dashboard-title">Kanban Board</h1>
              <p className="dashboard-subtitle">Drag tasks between columns to update status</p>
            </div>
            <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
              <HiPlus size={18} />
              Add Task
            </button>
          </div>

          {loading ? (
            <Loader text="Loading board..." />
          ) : (
            <div className="kanban-board">
              {COLUMNS.map((col) => {
                const colTasks = getColumnTasks(col.id);
                return (
                  <div
                    key={col.id}
                    className={`kanban-column ${dragOverCol === col.id ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    <div className="kanban-column-header">
                      <div className="kanban-col-dot" style={{ background: col.color }} />
                      <h3 className="kanban-col-title">{col.title}</h3>
                      <span className="kanban-col-count">{colTasks.length}</span>
                    </div>

                    <div className="kanban-column-body">
                      <AnimatePresence mode="popLayout">
                        {colTasks.length === 0 ? (
                          <div className="kanban-empty">
                            <p>No tasks</p>
                          </div>
                        ) : (
                          colTasks.map((task) => {
                            const dueDateLabel = getDueDateLabel(task.dueDate);
                            const overdue = isOverdue(task.dueDate, task.completed);

                            return (
                              <motion.div
                                key={task._id}
                                className="kanban-card glass"
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                              >
                                <div className="kanban-card-header">
                                  <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                                  <button
                                    className="btn-icon kanban-delete"
                                    onClick={() => deleteTask(task._id)}
                                    aria-label="Delete task"
                                  >
                                    <HiOutlineTrash size={14} />
                                  </button>
                                </div>
                                <h4 className="kanban-card-title">{task.title}</h4>
                                {task.description && (
                                  <p className="kanban-card-desc">{task.description}</p>
                                )}
                                <div className="kanban-card-footer">
                                  <span className="badge badge-category">
                                    <HiOutlineTag size={10} />
                                    {task.category}
                                  </span>
                                  {dueDateLabel && (
                                    <span className={`task-due ${overdue ? 'overdue' : ''}`}>
                                      <HiOutlineClock size={12} />
                                      {dueDateLabel}
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={null}
        categories={categories}
      />
    </div>
  );
};

export default Kanban;
