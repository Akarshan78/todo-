import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import EmptyState from '../UI/EmptyState';
import Loader from '../UI/Loader';

const TaskList = ({ tasks, loading, onToggle, onEdit, onDelete }) => {
  if (loading) {
    return <Loader text="Loading tasks..." />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        message="Start by creating your first task or adjust your filters."
      />
    );
  }

  return (
    <div className="task-list">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
