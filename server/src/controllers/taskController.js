const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  const tasks = await Task.find({
    $or: [{ createdBy: req.user._id }, { assignee: req.user._id }],
  })
    .populate('project', 'name status color')
    .populate('assignee', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, status, priority, project, assignee, dueDate } = req.body;
  const existingProject = await Project.findById(project);

  if (!existingProject) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    project,
    assignee: assignee || undefined,
    dueDate,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('project', 'name status color')
    .populate('assignee', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor');

  res.status(201).json(populatedTask);
};

const updateTaskStatus = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.status = req.body.status;
  const updated = await task.save();
  const populatedTask = await Task.findById(updated._id)
    .populate('project', 'name status color')
    .populate('assignee', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor');

  res.json(populatedTask);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updates = { ...req.body };

  if (updates.assignee === '') {
    updates.assignee = undefined;
  }

  Object.assign(task, updates);
  const updated = await task.save();
  const populatedTask = await Task.findById(updated._id)
    .populate('project', 'name status color')
    .populate('assignee', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor');

  res.json(populatedTask);
};

const removeTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await task.deleteOne();
  res.json({ message: 'Task removed' });
};

module.exports = {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  removeTask,
};
