const express = require('express');
const { getTeamMembers, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/team', protect, authorize('admin'), getTeamMembers);
router.post('/', protect, authorize('admin'), createUser);

module.exports = router;
