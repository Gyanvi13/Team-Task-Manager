const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const getOverview = async (req, res) => {
  const [projectCount, taskCount, memberCount, tasksByStatus] = await Promise.all([
    Project.countDocuments({ $or: [{ owner: req.user._id }, { members: req.user._id }] }),
    Task.countDocuments({ $or: [{ createdBy: req.user._id }, { assignee: req.user._id }] }),
    User.countDocuments({ role: 'member' }),
    Task.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]),
  ]);

  const statusMap = tasksByStatus.reduce((accumulator, item) => {
    accumulator[item._id] = item.total;
    return accumulator;
  }, {});

  res.json({
    totals: {
      projects: projectCount,
      tasks: taskCount,
      members: memberCount,
    },
    tasksByStatus: {
      todo: statusMap.todo || 0,
      'in-progress': statusMap['in-progress'] || 0,
      review: statusMap.review || 0,
      done: statusMap.done || 0,
    },
  });
};

module.exports = { getOverview };
