import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineClock, HiOutlineTag } from 'react-icons/hi';
import { getDueDateLabel, isOverdue } from '../../utils/helpers';
import './TaskCard.css';

const TaskCard = ({ task, onToggle, onEdit, onDelete, index = 0 }) => {
  const dueDateLabel = getDueDateLabel(task.dueDate);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <motion.div
      className={`task-card glass ${task.completed ? 'task-completed' : ''}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      layout
    >
      <div className="task-card-left">
        <button
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task._id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </button>
      </div>

      <div className="task-card-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`badge badge-${task.priority}`}>{task.priority}</span>
          <span className="badge badge-category">
            <HiOutlineTag size={10} />
            {task.category}
          </span>
          {dueDateLabel && (
            <span className={`task-due ${overdue ? 'overdue' : ''} ${dueDateLabel === 'Today' ? 'today' : ''}`}>
              <HiOutlineClock size={12} />
              {dueDateLabel}
            </span>
          )}
        </div>
      </div>

      <div className="task-card-actions">
        <button className="btn-icon" onClick={() => onEdit(task)} aria-label="Edit task">
          <HiOutlinePencil size={16} />
        </button>
        <button className="btn-icon task-delete-btn" onClick={() => onDelete(task._id)} aria-label="Delete task">
          <HiOutlineTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
