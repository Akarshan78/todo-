const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getCategories,
  getStats,
} = require('../controllers/taskController');

const router = express.Router();

// All task routes require authentication
router.use(auth);

/**
 * @route   GET /api/tasks/categories
 * @desc    Get unique categories
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (with search, filter, sort, pagination)
 */
router.get('/', getTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Category cannot exceed 50 characters'),
    body('dueDate')
      .optional({ values: 'null' })
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    validate,
  ],
  createTask
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('category')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Category cannot exceed 50 characters'),
    body('dueDate')
      .optional({ values: 'null' })
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('completed')
      .optional()
      .isBoolean()
      .withMessage('Completed must be true or false'),
    validate,
  ],
  updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    validate,
  ],
  deleteTask
);

/**
 * @route   PATCH /api/tasks/:id/toggle
 * @desc    Toggle task completion
 */
router.patch(
  '/:id/toggle',
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    validate,
  ],
  toggleTask
);

module.exports = router;
