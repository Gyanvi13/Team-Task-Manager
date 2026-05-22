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

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { loginUser, getCurrentUser };
