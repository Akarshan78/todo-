import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import { PRIORITIES, DEFAULT_CATEGORIES } from '../../utils/constants';
import { formatDateForInput } from '../../utils/helpers';
import './TaskForm.css';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null, categories = [] }) => {
  const isEdit = !!task;
  const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...categories])].sort();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'General',
        dueDate: formatDateForInput(task.dueDate) || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: 'General',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 200) newErrors.title = 'Title cannot exceed 200 characters';
    if (formData.description.length > 2000) newErrors.description = 'Description too long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        dueDate: formData.dueDate || null,
      };
      await onSubmit(payload);
      onClose();
    } catch {
      // Error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            autoFocus
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="form-input form-textarea"
            placeholder="Add details..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-selector">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`priority-option ${formData.priority === p.value ? 'selected' : ''}`}
                  onClick={() => handleChange('priority', p.value)}
                  style={formData.priority === p.value ? { background: p.bg, color: p.color, borderColor: p.color } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-category">Category</label>
            <select
              id="task-category"
              className="form-input form-select"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-duedate">Due Date</label>
          <input
            id="task-duedate"
            type="date"
            className="form-input"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
