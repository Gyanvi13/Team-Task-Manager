const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seedData = async () => {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return;
  }

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@teamtask.local',
    password: 'password123',
    role: 'admin',
    title: 'Delivery lead',
    avatarColor: '#0284c7',
  });

  const member = await User.create({
    name: 'Member User',
    email: 'member@teamtask.local',
    password: 'password123',
    role: 'member',
    title: 'Frontend engineer',
    avatarColor: '#10b981',
  });

  const project = await Project.create({
    name: 'Launch sprint',
    description: 'Coordinate the first release with clear milestones and ownership.',
    status: 'active',
    owner: admin._id,
    members: [member._id],
    color: '#38bdf8',
  });

  await Task.create([
    {
      title: 'Design onboarding flow',
      description: 'Map the first-use experience for new members.',
      status: 'in-progress',
      priority: 'high',
      project: project._id,
      assignee: member._id,
      createdBy: admin._id,
    },
    {
      title: 'Build project board',
      description: 'Create a polished project overview page.',
      status: 'todo',
      priority: 'medium',
      project: project._id,
      assignee: member._id,
      createdBy: admin._id,
    },
  ]);
};

module.exports = seedData;
