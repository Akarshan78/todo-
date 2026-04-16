import { useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, pages: 0 });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    completed: '',
    sort: '-createdAt',
  });

  // Fetch tasks
  const fetchTasks = useCallback(async (filterOverrides = {}) => {
    setLoading(true);
    try {
      const activeFilters = { ...filters, ...filterOverrides };
      const params = {};

      if (activeFilters.search) params.search = activeFilters.search;
      if (activeFilters.priority) params.priority = activeFilters.priority;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.completed !== '') params.completed = activeFilters.completed;
      if (activeFilters.sort) params.sort = activeFilters.sort;

      const res = await api.get('/tasks', { params });
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/tasks/categories');
      setCategories(res.data.data.categories);
    } catch {
      // Silently fail
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data.data);
    } catch {
      // Silently fail
    }
  }, []);

  // Create task
  const createTask = useCallback(async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [res.data.data.task, ...prev]);
      toast.success('Task created!');
      fetchCategories();
      fetchStats();
      return res.data.data.task;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }, [fetchCategories, fetchStats]);

  // Update task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data.task : t)));
      toast.success('Task updated!');
      fetchCategories();
      fetchStats();
      return res.data.data.task;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  }, [fetchCategories, fetchStats]);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted!');
      fetchCategories();
      fetchStats();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [fetchCategories, fetchStats]);

  // Toggle task completion
  const toggleTask = useCallback(async (id) => {
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data.task : t)));
      fetchStats();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [fetchStats]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      priority: '',
      category: '',
      completed: '',
      sort: '-createdAt',
    });
  }, []);

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchCategories();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  return {
    tasks,
    loading,
    categories,
    stats,
    pagination,
    filters,
    fetchTasks,
    fetchCategories,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    updateFilters,
    resetFilters,
  };
};
