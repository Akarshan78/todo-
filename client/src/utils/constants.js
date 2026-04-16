export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'var(--priority-high)', bg: 'var(--priority-high-bg)' },
  { value: 'medium', label: 'Medium', color: 'var(--priority-medium)', bg: 'var(--priority-medium-bg)' },
  { value: 'low', label: 'Low', color: 'var(--priority-low)', bg: 'var(--priority-low-bg)' },
];

export const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Academic',
  'Health',
  'Finance',
  'Shopping',
];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: 'dueDate', label: 'Due date (earliest)' },
  { value: '-dueDate', label: 'Due date (latest)' },
  { value: 'priority', label: 'Priority (high→low)' },
  { value: '-priority', label: 'Priority (low→high)' },
  { value: 'title', label: 'Title (A–Z)' },
];

export const FILTER_STATUS = [
  { value: '', label: 'All' },
  { value: 'false', label: 'Active' },
  { value: 'true', label: 'Completed' },
];
