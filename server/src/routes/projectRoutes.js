const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  addMemberToProject,
  removeProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getProjects).post(protect, authorize('admin'), createProject);
router.route('/:id').get(protect, getProjectById).put(protect, authorize('admin'), updateProject).delete(protect, authorize('admin'), removeProject);
router.post('/:id/members', protect, authorize('admin'), addMemberToProject);

module.exports = router;
