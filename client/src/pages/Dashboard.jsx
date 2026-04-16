import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import SearchBar from '../components/Tasks/SearchBar';
import TaskFilters from '../components/Tasks/TaskFilters';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { HiPlus } from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = () => {
  const {
    tasks,
    loading,
    categories,
    stats,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateFilters,
    resetFilters,
  } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleNewTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
  };

  const handleCategorySelect = (category) => {
    updateFilters({ category });
  };

  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar
        categories={categories}
        activeCategory={filters.category}
        onCategorySelect={handleCategorySelect}
        stats={stats}
        onNewTask={handleNewTask}
      />

      <main className="main-content">
        <div className="page-container">
          <div className="dashboard-header">
            <div className="dashboard-title-row">
              <div>
                <h1 className="dashboard-title">
                  {filters.category ? filters.category : 'All Tasks'}
                </h1>
                <p className="dashboard-subtitle">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} 
                  {filters.search ? ` matching "${filters.search}"` : ''}
                </p>
              </div>
              <button className="btn btn-primary mobile-add-btn" onClick={handleNewTask}>
                <HiPlus size={18} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="dashboard-toolbar">
              <SearchBar
                value={filters.search}
                onChange={(search) => updateFilters({ search })}
              />
              <TaskFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="task-list-container">
            <TaskList
              tasks={tasks}
              loading={loading}
              onToggle={toggleTask}
              onEdit={handleEditTask}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </main>

      <TaskForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        onSubmit={handleFormSubmit}
        task={editingTask}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;
