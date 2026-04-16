import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy');
};

/**
 * Format date for input[type=date]
 */
export const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Get smart due date label
 */
export const getDueDateLabel = (dateStr) => {
  if (!dateStr) return null;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return 'Overdue';
  return format(date, 'MMM d');
};

/**
 * Check if a due date is overdue
 */
export const isOverdue = (dateStr, completed) => {
  if (!dateStr || completed) return false;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return isPast(date) && !isToday(date);
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors) {
    return error.response.data.errors.map((e) => e.message).join('. ');
  }
  if (error.message) return error.message;
  return 'Something went wrong. Please try again.';
};
