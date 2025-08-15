
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ email, password, role });
  res.status(201).json({ token: generateToken(user), user: { email: user.email, role: user.role } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(400).json({ message: 'Invalid credentials' });

  res.json({ token: generateToken(user), user: { email: user.email, role: user.role } });
};
