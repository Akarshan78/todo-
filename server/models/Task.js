const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
      default: 'General',
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Allow null/undefined (optional field)
          if (!value) return true;
          // Due date must be a valid date
          return !isNaN(new Date(value).getTime());
        },
        message: 'Please provide a valid due date',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-scoped queries sorted by creation date
taskSchema.index({ user: 1, createdAt: -1 });

// Compound index for user-scoped queries sorted by due date
taskSchema.index({ user: 1, dueDate: 1 });

// Text index on title and description for search
taskSchema.index({ title: 'text', description: 'text' });

/**
 * Instance method: Clean JSON output
 */
taskSchema.methods.toJSON = function () {
  const task = this.toObject();
  delete task.__v;
  return task;
};

module.exports = mongoose.model('Task', taskSchema);
