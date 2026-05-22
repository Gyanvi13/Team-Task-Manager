const express = require('express');
const {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  removeTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getTasks).post(protect, authorize('admin'), createTask);
router.route('/:id').put(protect, authorize('admin'), updateTask).delete(protect, authorize('admin'), removeTask);
router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
