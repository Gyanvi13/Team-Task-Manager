const User = require('../models/User');

const getTeamMembers = async (req, res) => {
  const users = await User.find({ role: 'member' }).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const createUser = async (req, res) => {
  const { name, email, password, role, title, avatarColor } = req.body;
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role, title, avatarColor });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatarColor: user.avatarColor,
  });
};

module.exports = { getTeamMembers, createUser };
