const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for current user (with search, filter, sort)
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      priority,
      category,
      completed,
      sort = '-createdAt',
      page = 1,
      limit = 50,
    } = req.query;

    // Build query — always scoped to current user
    const query = { user: req.user.id };

    // Search by title/description (text search)
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Filter by category
    if (category && category.trim()) {
      query.category = category.trim();
    }

    // Filter by completion status
    if (completed !== undefined && completed !== '') {
      query.completed = completed === 'true';
    }

    // Build sort object
    let sortObj = {};
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    const allowedSorts = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    if (allowedSorts.includes(sortField)) {
      // Special handling for priority sort (custom order)
      if (sortField === 'priority') {
        // We'll sort after query using aggregation or manual sort
        sortObj = { createdAt: -1 }; // Default, will be overridden
      } else {
        sortObj[sortField] = sortOrder;
      }
    } else {
      sortObj = { createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    let tasks;
    const total = await Task.countDocuments(query);

    if (sortField === 'priority') {
      // Custom priority sort using aggregation
      const priorityOrder = sortOrder === 1
        ? { high: 1, medium: 2, low: 3 }
        : { low: 1, medium: 2, high: 3 };

      tasks = await Task.aggregate([
        { $match: query },
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'high'] }, then: priorityOrder.high },
                  { case: { $eq: ['$priority', 'medium'] }, then: priorityOrder.medium },
                  { case: { $eq: ['$priority', 'low'] }, then: priorityOrder.low },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { priorityOrder: 1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
        { $project: { priorityOrder: 0 } },
      ]);
    } else {
      tasks = await Task.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean();
    }

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    // Validate due date if provided
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid due date format.',
        });
      }
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, completed } = req.body;

    // Find task and ensure it belongs to current user
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Validate due date if provided
    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        task.dueDate = undefined;
      } else {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid due date format.',
          });
        }
        task.dueDate = parsedDate;
      }
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task completion status
 * @access  Private
 */
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}.`,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/categories
 * @desc    Get unique categories for current user
 * @access  Private
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Task.distinct('category', { user: req.user.id });

    res.status(200).json({
      success: true,
      data: { categories: categories.sort() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for current user
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const [stats] = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$completed', true] },
                    { $ne: ['$dueDate', null] },
                    { $lt: ['$dueDate', new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Category breakdown
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats || {
          total: 0,
          completed: 0,
          pending: 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0,
          overdue: 0,
        },
        categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getCategories,
  getStats,
};
