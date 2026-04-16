import { PRIORITIES, SORT_OPTIONS, FILTER_STATUS } from '../../utils/constants';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import './TaskFilters.css';

const TaskFilters = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = filters.priority || filters.completed !== '' || filters.sort !== '-createdAt';

  return (
    <div className="task-filters">
      <div className="filter-group">
        <div className="filter-pills">
          {FILTER_STATUS.map((status) => (
            <button
              key={status.value}
              className={`filter-pill ${filters.completed === status.value ? 'active' : ''}`}
              onClick={() => onFilterChange({ completed: status.value })}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-pills">
          <button
            className={`filter-pill ${filters.priority === '' ? 'active' : ''}`}
            onClick={() => onFilterChange({ priority: '' })}
          >
            All Priority
          </button>
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              className={`filter-pill priority-pill ${filters.priority === p.value ? 'active' : ''}`}
              onClick={() => onFilterChange({ priority: p.value })}
              style={filters.priority === p.value ? { background: p.bg, color: p.color, borderColor: p.color } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <select
          className="filter-select"
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          id="sort-select"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button className="filter-reset" onClick={onReset}>
          <HiX size={14} />
          Clear
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
