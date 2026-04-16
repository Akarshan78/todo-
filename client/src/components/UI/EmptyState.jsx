import { HiOutlineClipboardList } from 'react-icons/hi';
import './EmptyState.css';

const EmptyState = ({ icon, title = 'No tasks found', message = 'Create a new task to get started!', action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <HiOutlineClipboardList size={48} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
