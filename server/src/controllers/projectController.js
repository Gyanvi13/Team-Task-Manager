const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res) => {
  const projects = await Project.find({ $or: [{ owner: req.user._id }, { members: req.user._id }] })
    .populate('owner', 'name email role title avatarColor')
    .populate('members', 'name email role title avatarColor')
    .sort({ createdAt: -1 });

  res.json(projects);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email role title avatarColor')
    .populate('members', 'name email role title avatarColor');

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const tasks = await Task.find({ project: project._id })
    .populate('assignee', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor')
    .sort({ createdAt: -1 });

  res.json({ project, tasks });
};

const createProject = async (req, res) => {
  const { name, description, status, members, color } = req.body;
  const project = await Project.create({
    name,
    description,
    status,
    color,
    owner: req.user._id,
    members: Array.isArray(members) ? members : [],
  });

  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  Object.assign(project, req.body);
  const updated = await project.save();
  res.json(updated);
};

const addMemberToProject = async (req, res) => {
  const { memberId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (!project.members.some((member) => member.toString() === memberId)) {
    project.members.push(memberId);
    await project.save();
  }

  res.json(project);
};

const removeProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ message: 'Project removed' });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  addMemberToProject,
  removeProject,
};
