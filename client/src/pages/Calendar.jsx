import { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import Modal from '../components/UI/Modal';
import TaskForm from '../components/Tasks/TaskForm';
import Loader from '../components/UI/Loader';
import { useTasks } from '../hooks/useTasks';
import { HiChevronLeft, HiChevronRight, HiOutlineTag, HiPlus } from 'react-icons/hi';
import './Calendar.css';

const Calendar = () => {
  const { tasks, loading, stats, categories, toggleTask, createTask, updateFilters } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayTasks, setDayTasks] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState('');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  // Map tasks to dates
  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      return isSameDay(taskDate, date);
    });
  };

  const handleDateClick = (date) => {
    const dateTasks = getTasksForDate(date);
    setSelectedDate(date);
    setDayTasks(dateTasks);
  };

  const handleCreateFromDate = () => {
    setPrefillDate(format(selectedDate, 'yyyy-MM-dd'));
    setSelectedDate(null);
    setFormOpen(true);
  };

  const handleNewTask = () => {
    setPrefillDate('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    await createTask(data);
  };

  const handleCategorySelect = (category) => {
    updateFilters({ category });
  };

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar
        categories={categories}
        activeCategory=""
        onCategorySelect={handleCategorySelect}
        stats={stats}
        onNewTask={handleNewTask}
      />

      <main className="main-content">
        <div className="page-container">
          <div className="calendar-header">
            <h1 className="dashboard-title">Calendar</h1>
            <div className="calendar-nav">
              <button className="btn-icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Previous month">
                <HiChevronLeft size={22} />
              </button>
              <h2 className="calendar-month-label">{format(currentMonth, 'MMMM yyyy')}</h2>
              <button className="btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Next month">
                <HiChevronRight size={22} />
              </button>
            </div>
          </div>

          {loading ? (
            <Loader text="Loading calendar..." />
          ) : (
            <motion.div
              className="calendar-grid glass"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {weekDays.map((day) => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}

              {calDays.map((day, index) => {
                const dayTaskList = getTasksForDate(day);
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);
                const hasHigh = dayTaskList.some((t) => t.priority === 'high' && !t.completed);
                const hasMedium = dayTaskList.some((t) => t.priority === 'medium' && !t.completed);
                const hasLow = dayTaskList.some((t) => t.priority === 'low' && !t.completed);

                return (
                  <motion.div
                    key={day.toISOString()}
                    className={`calendar-day ${!inMonth ? 'out-month' : ''} ${today ? 'today' : ''} ${dayTaskList.length > 0 ? 'has-tasks' : ''}`}
                    onClick={() => handleDateClick(day)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <span className="day-number">{format(day, 'd')}</span>
                    {dayTaskList.length > 0 && (
                      <div className="day-dots">
                        {hasHigh && <span className="day-dot dot-high" />}
                        {hasMedium && <span className="day-dot dot-medium" />}
                        {hasLow && <span className="day-dot dot-low" />}
                      </div>
                    )}
                    {dayTaskList.length > 0 && (
                      <span className="day-count">{dayTaskList.length}</span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>

      {/* Day Detail Modal */}
      <Modal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}
        size="md"
      >
        <div className="day-modal-actions">
          <button className="btn btn-primary btn-sm" onClick={handleCreateFromDate}>
            <HiPlus size={14} />
            Add task on this date
          </button>
        </div>
        {dayTasks.length === 0 ? (
          <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem' }}>
            No tasks due on this date.
          </p>
        ) : (
          <div className="day-task-list">
            {dayTasks.map((task) => (
              <div key={task._id} className={`day-task-item ${task.completed ? 'completed' : ''}`}>
                <button
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task._id)}
                >
                  {task.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                </button>
                <div className="day-task-info">
                  <span className="day-task-title">{task.title}</span>
                  <div className="day-task-meta">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <span className="badge badge-category">
                      <HiOutlineTag size={10} />
                      {task.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Task Creation Form (from calendar) */}
      <TaskForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setPrefillDate(''); }}
        onSubmit={handleFormSubmit}
        task={prefillDate ? { dueDate: prefillDate } : null}
        categories={categories}
      />
    </div>
  );
};

export default Calendar;
