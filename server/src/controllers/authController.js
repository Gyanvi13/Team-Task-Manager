const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      avatarColor: user.avatarColor,
    },
    token: generateToken({ id: user._id }),
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists' });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'member',
  });

  return res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      avatarColor: user.avatarColor,
    },
    token: generateToken({ id: user._id }),
  });
};

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { loginUser, registerUser, getCurrentUser };
